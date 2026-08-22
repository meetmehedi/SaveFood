"""
SaveFood - Open Food Facts API Client
Fetches real-time nutrition, packaging, eco-score, and expiry data for food items.
Author: Md. Mehedi Hasan (Roll: 04, DIU)
"""

import requests
import json
import os

CACHE_FILE = "data/open_food_facts_cache.json"

DEFAULT_FOOD_DATABASE = [
    {
        "code": "3017620422003",
        "product_name": "Nutella Hazelnut Spread",
        "brands": "Ferrero",
        "categories": "Dairy & Spreads",
        "nutriscore_grade": "e",
        "ecoscore_grade": "d",
        "image_url": "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.514.400.jpg",
        "packaging": "Glass jar, plastic lid",
        "storage_conditions": "Store in a cool, dry place away from sunlight (18-20°C)",
        "shelf_life_opened_days": 30,
        "ingredients_text": "Sugar, palm oil, hazelnuts 13%, skimmed milk powder 8.7%, fat-reduced cocoa 7.4%, emulsifier: lecithins (soya), vanillin.",
        "serving_size": "15g",
        "calories_100g": 539
    },
    {
        "code": "5449000000996",
        "product_name": "Coca-Cola Original Taste",
        "brands": "Coca-Cola",
        "categories": "Beverages",
        "nutriscore_grade": "e",
        "ecoscore_grade": "b",
        "image_url": "https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.618.400.jpg",
        "packaging": "Aluminium can",
        "storage_conditions": "Keep cool and dry. Consume within 2 days after opening.",
        "shelf_life_opened_days": 2,
        "ingredients_text": "Carbonated water, sugar, colour (caramel E150d), phosphoric acid, natural flavourings including caffeine.",
        "serving_size": "330ml",
        "calories_100g": 42
    },
    {
        "code": "7622210449283",
        "product_name": "Oreo Original Sandwich Cookies",
        "brands": "Mondelez",
        "categories": "Bakery",
        "nutriscore_grade": "e",
        "ecoscore_grade": "d",
        "image_url": "https://images.openfoodfacts.org/images/products/762/221/044/9283/front_en.164.400.jpg",
        "packaging": "Plastic wrapper, cardboard box",
        "storage_conditions": "Store in an airtight container once opened.",
        "shelf_life_opened_days": 14,
        "ingredients_text": "Wheat flour, sugar, palm oil, fat-reduced cocoa powder 4.5%, wheat starch, glucose-fructose syrup, raising agents, salt, emulsifiers, flavoring.",
        "serving_size": "22.8g",
        "calories_100g": 474
    },
    {
        "code": "8480000164674",
        "product_name": "Whole Milk / Leche Entera",
        "brands": "Hacendado",
        "categories": "Dairy",
        "nutriscore_grade": "b",
        "ecoscore_grade": "b",
        "image_url": "https://images.openfoodfacts.org/images/products/848/000/016/4674/front_es.36.400.jpg",
        "packaging": "Tetra Brik",
        "storage_conditions": "Keep refrigerated at 2-6°C. Consume within 3-4 days of opening.",
        "shelf_life_opened_days": 4,
        "ingredients_text": "Whole cow's milk, Vitamin D.",
        "serving_size": "250ml",
        "calories_100g": 62
    },
    {
        "code": "3229820786015",
        "product_name": "Greek Style Plain Yogurt",
        "brands": "Danone",
        "categories": "Dairy",
        "nutriscore_grade": "a",
        "ecoscore_grade": "b",
        "image_url": "https://images.openfoodfacts.org/images/products/322/982/078/6015/front_fr.117.400.jpg",
        "packaging": "Plastic pot, aluminium lid",
        "storage_conditions": "Keep refrigerated at max +6°C.",
        "shelf_life_opened_days": 5,
        "ingredients_text": "Whole milk, cream, live yogurt cultures.",
        "serving_size": "125g",
        "calories_100g": 115
    },
    {
        "code": "8076800195057",
        "product_name": "Barilla Spaghetti No. 5",
        "brands": "Barilla",
        "categories": "Pantry & Grains",
        "nutriscore_grade": "a",
        "ecoscore_grade": "a",
        "image_url": "https://images.openfoodfacts.org/images/products/807/680/019/5057/front_en.111.400.jpg",
        "packaging": "Cardboard box, 100% recyclable",
        "storage_conditions": "Store in a dry, dark place.",
        "shelf_life_opened_days": 180,
        "ingredients_text": "Durum wheat semolina, water.",
        "serving_size": "85g",
        "calories_100g": 359
    },
    {
        "code": "7311070005706",
        "product_name": "Oat Milk Barista Edition",
        "brands": "Oatly",
        "categories": "Dairy Alternatives",
        "nutriscore_grade": "b",
        "ecoscore_grade": "a",
        "image_url": "https://images.openfoodfacts.org/images/products/731/107/000/5706/front_en.128.400.jpg",
        "packaging": "Tetra Pak",
        "storage_conditions": "Once opened, keep refrigerated and consume within 5 days.",
        "shelf_life_opened_days": 5,
        "ingredients_text": "Oat base (water, oats 10%), rapeseed oil, dipotassium phosphate, calcium carbonate, calcium phosphates, iodised salt, vitamins (D2, riboflavin, B12).",
        "serving_size": "100ml",
        "calories_100g": 59
    },
    {
        "code": "3033490004523",
        "product_name": "Bonne Maman Strawberry Conserve",
        "brands": "Bonne Maman",
        "categories": "Pantry & Spreads",
        "nutriscore_grade": "d",
        "ecoscore_grade": "b",
        "image_url": "https://images.openfoodfacts.org/images/products/303/349/000/4523/front_fr.96.400.jpg",
        "packaging": "Glass jar, metal twist lid",
        "storage_conditions": "Refrigerate after opening and consume within 3 weeks.",
        "shelf_life_opened_days": 21,
        "ingredients_text": "Strawberries, sugar, cane sugar, concentrated lemon juice, gelling agent (fruit pectin).",
        "serving_size": "20g",
        "calories_100g": 240
    }
]

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_cache(cache_data):
    os.makedirs("data", exist_ok=True)
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(cache_data, f, indent=2)
    except Exception:
        pass

def get_product_by_barcode(barcode):
    """
    Looks up a food item by barcode using the official Open Food Facts API v2.
    Falls back to local cache/database if offline or not found.
    """
    barcode = str(barcode).strip()
    cache = load_cache()
    if barcode in cache:
        return cache[barcode]
        
    # Check default DB
    for item in DEFAULT_FOOD_DATABASE:
        if item["code"] == barcode:
            return {"success": True, "product": item, "source": "local_database"}

    # Query Open Food Facts API
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    headers = {
        "User-Agent": "SaveFood-DIU-Research-App - Web - Version 1.0"
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == 1:
                p = data.get("product", {})
                
                nutriments = p.get("nutriments", {})
                calories = nutriments.get("energy-kcal_100g") or nutriments.get("energy-kcal") or 0
                
                product_info = {
                    "code": barcode,
                    "product_name": p.get("product_name") or p.get("product_name_en") or "Scanned Food Item",
                    "brands": p.get("brands", "Generic Brand"),
                    "categories": p.get("categories", "Packaged Food").split(",")[0],
                    "nutriscore_grade": (p.get("nutriscore_grade") or "unknown").upper(),
                    "ecoscore_grade": (p.get("ecoscore_grade") or "unknown").upper(),
                    "image_url": p.get("image_url") or p.get("image_front_url") or "",
                    "packaging": p.get("packaging", "Standard packaging"),
                    "storage_conditions": p.get("conservation_conditions_en") or p.get("storage_conditions") or "Store in a cool dry place or refrigerate after opening.",
                    "shelf_life_opened_days": 7,
                    "ingredients_text": p.get("ingredients_text_en") or p.get("ingredients_text") or "Not specified",
                    "serving_size": p.get("serving_size", "100g"),
                    "calories_100g": calories
                }
                
                cache[barcode] = {"success": True, "product": product_info, "source": "open_food_facts_api"}
                save_cache(cache)
                return cache[barcode]
    except Exception as e:
        print(f"Open Food Facts query error: {e}")

    # Fallback product format
    return {
        "success": False,
        "message": f"Product with barcode {barcode} not found on Open Food Facts. You can enter details manually.",
        "sample_barcodes": [item["code"] + f" ({item['product_name']})" for item in DEFAULT_FOOD_DATABASE[:4]]
    }

def search_products(query, limit=6):
    """
    Searches for food items by keyword on Open Food Facts or local directory.
    """
    query = query.lower().strip()
    results = []
    
    # Check local default DB first
    for item in DEFAULT_FOOD_DATABASE:
        if query in item["product_name"].lower() or query in item["categories"].lower() or query in item["brands"].lower():
            results.append(item)
            
    if len(results) >= limit:
        return {"success": True, "results": results[:limit], "source": "local_db"}
        
    # Search online Open Food Facts
    try:
        url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&action=process&json=1&page_size={limit}"
        headers = {"User-Agent": "SaveFood-DIU-Research-App - Web - Version 1.0"}
        resp = requests.get(url, headers=headers, timeout=4)
        if resp.status_code == 200:
            data = resp.json()
            products = data.get("products", [])
            for p in products:
                name = p.get("product_name") or p.get("product_name_en")
                if name and not any(r["product_name"] == name for r in results):
                    nutriments = p.get("nutriments", {})
                    results.append({
                        "code": p.get("code", "00000000"),
                        "product_name": name,
                        "brands": p.get("brands", "Generic"),
                        "categories": p.get("categories", "Food").split(",")[0],
                        "nutriscore_grade": (p.get("nutriscore_grade") or "C").upper(),
                        "ecoscore_grade": (p.get("ecoscore_grade") or "B").upper(),
                        "image_url": p.get("image_url") or p.get("image_front_url") or "",
                        "packaging": p.get("packaging", "Recyclable"),
                        "storage_conditions": "Keep cool and dry.",
                        "shelf_life_opened_days": 5,
                        "ingredients_text": p.get("ingredients_text", "Natural ingredients"),
                        "serving_size": "100g",
                        "calories_100g": nutriments.get("energy-kcal_100g", 120)
                    })
    except Exception as e:
        print(f"Search API error: {e}")

    return {"success": True, "results": results[:limit], "query": query}
