import { Product } from "../types";
import { parseCsvLine } from "./csvParser";

export interface SheetConfig {
  id: string; // unique ID
  name: string; // user friendly label, e.g. "Main Catalog"
  urlOrId: string; // Google Sheet URL or ID
  syncInterval: "manual" | "hour" | "6hours" | "daily";
  categoryFilter: string; // "All" or category name
  isActive: boolean;
  lastSyncTime?: string;
}

export interface SyncLogEntry {
  id: string;
  sheetName: string;
  timestamp: string;
  status: "success" | "failed";
  addedCount: number;
  updatedCount: number;
  skippedCount: number;
  failedRows: { row: number; id: string; name: string; reason: string }[];
  logText: string;
}

/**
 * Extracts the spreadsheet ID from various formats of Google Sheets sharing/editor URLs or returns the raw ID.
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  
  // Standard editor link regex: /spreadsheets/d/([a-zA-Z0-9-_]+)
  const dRegex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const dMatch = trimmed.match(dRegex);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  // Raw interactive published link: /spreadsheets/([a-zA-Z0-9-_]+)
  const relativeRegex = /\/spreadsheets\/([a-zA-Z0-9-_]+)/;
  const relMatch = trimmed.match(relativeRegex);
  if (relMatch && relMatch[1]) {
    return relMatch[1];
  }

  return trimmed;
}

/**
 * Formats the Sheet ID into the appropriate export URL.
 */
export function getSheetFetchUrl(sheetId: string): string {
  // Use public export in CSV format as it doesn't require Google API credentials
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
}

/**
 * Validates a sheet cell URL to check basic HTTP schema configuration.
 */
export function isValidUrl(str: string): boolean {
  if (!str) return false;
  const s = str.trim().toLowerCase();
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.includes("unsplash.com") || s.includes("dummyimage.com") || s.includes("images.unsplash.com");
}

/**
 * Takes raw Google Sheet CSV string, validates each row against product schemas, 
 * calculates badges, checks for errors, and categorizes counts into added, updated, skipped.
 */
export function parseAndValidateSheetData(
  csvData: string,
  existingProducts: Product[],
  categoryFilter: string = "All"
): {
  validProductsToSave: Product[];
  processedProducts: Product[];
  skippedRows: { row: number; id: string; name: string; reason: string }[];
  skippedCount: number;
  addedCount: number;
  updatedCount: number;
} {
  const lines = csvData.split(/\r?\n/).filter(l => l.trim() !== "");
  const skippedRows: { row: number; id: string; name: string; reason: string }[] = [];
  
  if (lines.length < 2) {
    return {
      validProductsToSave: [],
      processedProducts: [],
      skippedRows: [{ row: 0, id: "", name: "", reason: "Empty document or missing table headers" }],
      skippedCount: 0,
      addedCount: 0,
      updatedCount: 0
    };
  }

  const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase().replace(/_/g, ""));
  const validProductsToSave: Product[] = [];
  const existingMap = new Map<string, Product>();
  existingProducts.forEach(p => existingMap.set(p.id, p));

  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  // Track unique IDs loaded in THIS parse batch to prevent internal sheet duplicates
  const sheetIdsFoundInThisSheet = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1; // 1-indexed for headers
    const fields = parseCsvLine(lines[i]);
    
    if (fields.length === 0 || (fields.length === 1 && fields[0] === "")) {
      continue;
    }

    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = fields[index] || "";
    });

    const rawId = (record.id || record.slug || record.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || "").trim();
    const rawName = (record.name || "").trim();

    // 1. Validate ID
    if (!rawId) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: "",
        name: rawName || "Row with empty ID",
        reason: "Missing primary ID or slug value."
      });
      continue;
    }

    // 2. Prevent within-spreadsheet duplicate IDs
    if (sheetIdsFoundInThisSheet.has(rawId)) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: rawName,
        reason: `Duplicate row entry with ID '${rawId}' in same Google Sheet.`
      });
      continue;
    }
    sheetIdsFoundInThisSheet.add(rawId);

    // 3. Validate Product Name
    if (!rawName) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: "",
        reason: "Product name is required, column must not be empty."
      });
      continue;
    }

    // 4. Category check & category filter configuration
    const rawCategory = (record.category || "General").trim();
    if (!rawCategory) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: rawName,
        reason: "Category cannot be empty if specified."
      });
      continue;
    }

    if (categoryFilter !== "All" && rawCategory.toLowerCase() !== categoryFilter.toLowerCase()) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: rawName,
        reason: `Filtered out: Category '${rawCategory}' didn't match sheet restriction '${categoryFilter}'.`
      });
      continue;
    }

    // 5. Price valid integer check
    const rawPriceClean = (record.price || "0").replace(/[^0-9.]/g, "");
    const priceVal = parseFloat(rawPriceClean);
    if (isNaN(priceVal) || priceVal <= 0) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: rawName,
        reason: `Invalid price structure: '${record.price}'. Must be a positive decimal number.`
      });
      continue;
    }

    const origPriceRaw = record.originalprice || record.original_price || "";
    const origPriceClean = origPriceRaw.replace(/[^0-9.]/g, "");
    const originalPriceVal = origPriceClean ? parseFloat(origPriceClean) : undefined;
    
    if (originalPriceVal !== undefined && (isNaN(originalPriceVal) || originalPriceVal < priceVal)) {
      skippedCount++;
      skippedRows.push({
        row: rowNum,
        id: rawId,
        name: rawName,
        reason: `original_price (${record.original_price}) must be higher than selling price (${record.price}).`
      });
      continue;
    }

    // 6. Validate Image and Video URL configurations
    const imagesStr = record.images || "";
    const images = imagesStr
      ? imagesStr.split(";").map(img => img.trim()).filter(Boolean)
      : [];

    const videosStr = record.videos || "";
    const videos = videosStr
      ? videosStr.split(";").map(vid => vid.trim()).filter(Boolean)
      : [];

    // URL scheme check
    let urlError = false;
    for (const imgUrl of images) {
      if (!isValidUrl(imgUrl)) {
        skippedCount++;
        skippedRows.push({
          row: rowNum,
          id: rawId,
          name: rawName,
          reason: `Invalid image URL: '${imgUrl}'. Must start with http:// or https://.`
        });
        urlError = true;
        break;
      }
    }
    if (urlError) continue;

    for (const vidUrl of videos) {
      if (!isValidUrl(vidUrl)) {
        skippedCount++;
        skippedRows.push({
          row: rowNum,
          id: rawId,
          name: rawName,
          reason: `Invalid video URL: '${vidUrl}'. Must start with http:// or https://.`
        });
        urlError = true;
        break;
      }
    }
    if (urlError) continue;

    // 7. Parse specifications and nested properties
    const specsStr = record.specs || record.specifications || "";
    const specs = specsStr
      ? specsStr.split(";").map(s => s.trim()).filter(Boolean)
      : [];

    const colorsStr = record.colors || "";
    const colors = colorsStr
      ? colorsStr.split(";").map(c => c.trim()).filter(Boolean)
      : undefined;

    const storagesStr = record.storages || record.storage_variants || "";
    const storages = storagesStr
      ? storagesStr.split(";").map(s => s.trim()).filter(Boolean)
      : undefined;

    const detailedSpecsStr = record.detailedspecs || record.detailed_specs || "";
    const detailedSpecs = detailedSpecsStr
      ? detailedSpecsStr.split(";").map(pair => {
          const parts = pair.split(":");
          const label = parts[0]?.trim() || "";
          const value = parts.slice(1).join(":")?.trim() || "";
          return { label, value };
        }).filter(item => item.label && item.value)
      : undefined;

    // 8. Align stock status
    let stockStatus: Product["stockStatus"] = "In Stock";
    const rawStock = (record.stockstatus || record.stock_status || "").toLowerCase();
    if (rawStock.includes("out")) {
      stockStatus = "Out of Stock";
    } else if (rawStock.includes("low")) {
      stockStatus = "Low Stock";
    }

    // 9. Auto-calculation of Dynamic Discount Badges
    let badge = (record.badge || "").trim() || undefined;
    if (originalPriceVal && originalPriceVal > priceVal) {
      const discountPct = Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100);
      if (discountPct > 0 && !badge) {
        badge = `${discountPct}% OFF`;
      }
    }

    // Setup fallback details
    const ratingRaw = parseFloat(record.rating || "5.0");
    const rating = isNaN(ratingRaw) ? 5.0 : Math.max(0, Math.min(5, ratingRaw));
    
    const reviewsRaw = parseInt(record.reviewscount || record.reviews_count || "12", 10);
    const reviewsCount = isNaN(reviewsRaw) ? 12 : reviewsRaw;

    const finishedProduct: Product = {
      id: rawId,
      name: rawName,
      category: rawCategory,
      price: priceVal,
      originalPrice: originalPriceVal,
      badge,
      specs,
      colors,
      storages,
      stockStatus,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60"], // default fallback high contrast Unsplash mockup
      videos,
      description: record.description || "Certified Ugandan imports. Authorized dealer-sealed with instantaneous guarantees.",
      rating,
      reviewsCount,
      iconName: "Smartphone", // Default category smartphone
      videoPreview: record.videopreview || record.video_preview || undefined,
      detailedSpecs
    };

    validProductsToSave.push(finishedProduct);

    // Check if ID already exists to determine Add vs Update count metrics
    if (existingMap.has(rawId)) {
      updatedCount++;
    } else {
      addedCount++;
    }
  }

  return {
    validProductsToSave,
    processedProducts: validProductsToSave,
    skippedRows,
    skippedCount,
    addedCount,
    updatedCount
  };
}
