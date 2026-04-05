/**
 * Extended Indian Foods Catalog — 510 items from NutriSutra seed database.
 * Used for: homepage category counts, food search, regional filtering.
 *
 * Each entry has: name, region, state, primaryCategory, subcategory, isVeg, typicalMeal
 * Nutrition data is estimated per typical serving using category averages.
 */

export interface CatalogEntry {
  name: string;
  region: string;
  state: string;
  primaryCategory: string;
  subcategory: string;
  isVeg: boolean;
  typicalMeal: string;
}

export const INDIAN_FOOD_CATALOG: CatalogEntry[] = [
  // ═══════════════════════════════════════
  // SOUTH INDIA — Multi-South (general)
  // ═══════════════════════════════════════
  { name: "Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Sambar Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Rava Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Kanchipuram Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Mini Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Medu Vada", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Sambar Vada", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Plain Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Masala Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Rava Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Set Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Paper Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Pesarattu", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Uttapam", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Onion Uttapam", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Pongal", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Ven Pongal", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Curd Rice", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Lemon Rice", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Tamarind Rice", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Coconut Rice", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Tomato Rice", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Bisibele Bath", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Akki Roti", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Neer Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Mysore Pak", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Obbattu", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Kesari Bath", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Puliyogare", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Maddur Vada", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Thatte Idli", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Benne Dosa", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Avial", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Thoran", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Appam", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Stew", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Puttu", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Kadala Curry", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Malabar Parotta", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Kerala Sadya", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Erissery", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },
  { name: "Olan", region: "South India", state: "Multi-South", primaryCategory: "Breakfast", subcategory: "Tiffin", isVeg: true, typicalMeal: "Breakfast" },

  // ═══════════════════════════════════════
  // SOUTH INDIA — Andhra / Telangana
  // ═══════════════════════════════════════
  { name: "Hyderabadi Chicken Biryani", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Hyderabadi Mutton Biryani", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Chicken 65", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mirchi Bajji", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bagara Baingan", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gongura Pachadi", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gongura Chicken", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gutti Vankaya", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pesarattu Upma", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pulihora", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Sakinalu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Sarva Pindi", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kodi Kura", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Royyala Iguru", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Natu Kodi Pulusu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Chepala Pulusu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Ulavacharu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Punugulu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bobbatlu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Qubani ka Meetha", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Double Ka Meetha", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Haleem", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pathar Ka Gosht", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Keema Samosa", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Osmania Biscuit", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Irani Chai", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Andhra Chicken Curry", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Tomato Pappu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Beerakaya Pappu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mamidikaya Pappu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Aloo Kurma", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kakarakaya Fry", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Dondakaya Fry", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Ragi Sangati", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pachi Pulusu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Andhra Mutton Curry", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rasam", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Payasam", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Boorelu", region: "South India", state: "Andhra/Telangana", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },

  // ═══════════════════════════════════════
  // SOUTH INDIA — Tamil Nadu
  // ═══════════════════════════════════════
  { name: "Chettinad Chicken", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chettinad Fish Curry", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kothu Parotta", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Parotta Salna", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kara Kuzhambu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Vatha Kuzhambu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mor Kuzhambu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sakkarai Pongal", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kuzhi Paniyaram", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Adai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Adai Avial", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Curd Sevai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Idiyappam", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Lemon Sevai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Tomato Sevai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chicken Sukka", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mutton Chukka", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Keerai Kootu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Poriyal", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Beans Poriyal", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Cabbage Poriyal", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Lemon Rasam", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pepper Rasam", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Thayir Sadam", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Puliyodarai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bisibelebath", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Filter Coffee", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Jigarthanda", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kambu Koozh", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Thinai Pongal", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Ragi Kali", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Meen Kuzhambu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Nethili Fry", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kalan", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kootu", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Paal Payasam", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Murukku", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Seedai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Thattai", region: "South India", state: "Tamil Nadu", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // NORTH INDIA — Punjabi / North
  // ═══════════════════════════════════════
  { name: "Butter Chicken", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Paneer Butter Masala", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Dal Makhani", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rajma Chawal", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Chole Bhature", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Amritsari Kulcha", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Sarson Ka Saag", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Makki Di Roti", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Shahi Paneer", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kadai Paneer", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Palak Paneer", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Aloo Paratha", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gobi Paratha", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Paneer Paratha", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Methi Paratha", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Lassi", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Boondi Raita", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Jeera Rice", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Veg Pulao", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Chicken Curry", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mutton Rogan Josh", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Tandoori Chicken", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Chicken Tikka", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Seekh Kebab", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Malai Kofta", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Aloo Gobi", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bhindi Masala", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Baingan Bharta", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kadhi Pakora", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Samosa", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pakora", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Aloo Tikki", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kachori", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pani Puri", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Papdi Chaat", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Dahi Bhalla", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Jalebi", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gulab Jamun", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rasmalai", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kulfi", region: "North India", state: "Punjabi/North", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },

  // ═══════════════════════════════════════
  // NORTH INDIA — Rajasthan
  // ═══════════════════════════════════════
  { name: "Laal Maas", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Dal Baati Churma", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Gatte Ki Sabzi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Ker Sangri", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Pyaaz Kachori", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mirchi Bada", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mawa Kachori", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rajasthani Kadhi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bajre Ki Roti", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Methi Bajra Poori", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rabdi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Ghewar", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Malpua", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mohan Maas", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Papad Ki Sabzi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Besan Chilla", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Panchmel Dal", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Aam Ki Launji", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Moong Dal Halwa", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Churma Ladoo", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kalmi Vada", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kadhi Kachori", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Rajasthani Thali", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Jodhpuri Kabuli", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Safed Maas", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Kachra Mirchi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bikaneri Bhujia", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Mirchi Vada", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Bajra Khichdi", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },
  { name: "Missi Roti", region: "North India", state: "Rajasthan", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "Lunch/Dinner" },

  // ═══════════════════════════════════════
  // WEST INDIA — Maharashtra
  // ═══════════════════════════════════════
  { name: "Poha", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kanda Poha", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Misal Pav", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pav Bhaji", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Vada Pav", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sabudana Khichdi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Thalipeeth", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Puran Poli", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Modak", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Zunka Bhakar", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bharli Vangi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Varan Bhaat", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Batata Bhaji", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kothimbir Vadi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Shrikhand", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Basundi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bombay Sandwich", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bhel Puri", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sev Puri", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Ragda Pattice", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Usal Pav", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kolhapuri Chicken", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kolhapuri Mutton", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sol Kadhi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Fish Fry", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bombil Fry", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pithla Bhakri", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sabudana Vada", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kokum Sharbat", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Aamras", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pav Misal", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Masale Bhat", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Alu Wadi", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Patra", region: "West India", state: "Maharashtra", primaryCategory: "Street Food", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // WEST INDIA — Gujarat
  // ═══════════════════════════════════════
  { name: "Dhokla", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Khaman", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Handvo", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Thepla", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Methi Thepla", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Undhiyu", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Khichu", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Fafda", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Jalebi Fafda", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Sev Khamani", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Gujarati Patra", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Dal Dhokli", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Gujarati Kadhi", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Khichdi", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Bajra Rotla", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Lasaniya Batata", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Ringan no Olo", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Dabeli", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Khakhra", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Mohanthal", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Sutarfeni", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Gujarati Basundi", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Aamras Puri", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Lilva Kachori", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Gathiya", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Bhakri", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Bharela Marcha", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Sev Tameta", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Kansar", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Mag ni Dal", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },
  { name: "Surti Locho", region: "West India", state: "Gujarat", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: true, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // EAST INDIA — Bihar / Jharkhand
  // ═══════════════════════════════════════
  { name: "Litti Chokha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sattu Paratha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Aloo Bhujia", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bihar Kadhi Bari", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Thekua", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Khaja", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Balushahi", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Champaran Mutton", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Dal Pitha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Makhana Kheer", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bihari Malpua", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Dhuska", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bihari Ghugni", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pua", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Tilkut", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Parwal Mithai", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Aloo Chokha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Baingan Chokha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Tomato Chokha", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bihari Kebab", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sattu Sharbat", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Handi Mutton", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kala Jamun", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pedakiya", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kadhi Badi", region: "East India", state: "Bihar/Jharkhand", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // EAST INDIA — West Bengal
  // ═══════════════════════════════════════
  { name: "Machher Jhol", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Shorshe Ilish", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Aloo Posto", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Luchi", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kosha Mangsho", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Cholar Dal", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Beguni", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Fish Fry Bengali", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Muri Ghonto", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Puchka", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bengali Ghugni", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Shukto", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mishti Doi", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Rasgulla", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Sandesh", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pantua", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kathi Roll", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mughlai Paratha", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chingri Malai Curry", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mutton Rezala", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Basanti Pulao", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Labra", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mochar Ghonto", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Nolen Gurer Payesh", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Patishapta", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bengali Aloo Dum", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Jhalmuri", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Dhokar Dalna", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Bhetki Paturi", region: "East India", state: "West Bengal", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // EAST INDIA — Odisha
  // ═══════════════════════════════════════
  { name: "Dalma", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Pakhala Bhata", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Santula", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chhena Poda", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chhena Jhili", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Rasabali", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Dahi Bara Aloo Dum", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Khicede", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Macha Besara", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kanika", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Puri Upma", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Kakara Pitha", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Arisa Pitha", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Enduri Pitha", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Chhena Tarkari", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Mudhi Mansa", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Prawn Kassa", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Potala Rasa", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Badi Chura", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Saga Bhaja", region: "East India", state: "Odisha", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },

  // ═══════════════════════════════════════
  // EAST INDIA — Assam
  // ═══════════════════════════════════════
  { name: "Assam Laksa", region: "East India", state: "Assam", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
  { name: "Masor Tenga", region: "East India", state: "Assam", primaryCategory: "Main Course", subcategory: "Regional Special", isVeg: false, typicalMeal: "All-day" },
];

// ═══════════════════════════════════════
// Category counting helpers — used on homepage
// ═══════════════════════════════════════

export interface CategoryCount {
  label: string;
  count: number;
  key: string;
  /** Color used for card accent */
  color: string;
}

/**
 * Gets count of items by state grouping for display on homepage.
 * Merges items from the 510-item catalog + the nutrition database.
 */
export function getRegionalCategoryCounts(): CategoryCount[] {
  const stateMap: Record<string, number> = {};

  for (const item of INDIAN_FOOD_CATALOG) {
    // Group Multi-South items under broader regional categories
    const key = item.state === "Multi-South" ? item.region : item.state;
    stateMap[key] = (stateMap[key] || 0) + 1;
  }

  // Merge: if Tamil Nadu + Multi-South both exist, keep them meaningful
  const categories: CategoryCount[] = [
    { label: "Andhra & Telangana", key: "Andhra/Telangana", count: stateMap["Andhra/Telangana"] || 0, color: "from-red-500 to-orange-500" },
    { label: "Tamil Nadu", key: "Tamil Nadu", count: stateMap["Tamil Nadu"] || 0, color: "from-amber-500 to-yellow-500" },
    { label: "Kerala & Karnataka", key: "South India", count: stateMap["South India"] || 0, color: "from-emerald-500 to-green-500" },
    { label: "Punjabi & North Indian", key: "Punjabi/North", count: stateMap["Punjabi/North"] || 0, color: "from-orange-500 to-red-500" },
    { label: "Rajasthani", key: "Rajasthan", count: stateMap["Rajasthan"] || 0, color: "from-yellow-500 to-amber-600" },
    { label: "Maharashtrian", key: "Maharashtra", count: stateMap["Maharashtra"] || 0, color: "from-purple-500 to-violet-500" },
    { label: "Gujarati", key: "Gujarat", count: stateMap["Gujarat"] || 0, color: "from-teal-500 to-cyan-500" },
    { label: "Bengali", key: "West Bengal", count: stateMap["West Bengal"] || 0, color: "from-blue-500 to-indigo-500" },
    { label: "Odia", key: "Odisha", count: stateMap["Odisha"] || 0, color: "from-sky-500 to-blue-500" },
    { label: "Bihari", key: "Bihar/Jharkhand", count: stateMap["Bihar/Jharkhand"] || 0, color: "from-lime-500 to-green-500" },
    { label: "Assamese", key: "Assam", count: stateMap["Assam"] || 0, color: "from-pink-500 to-rose-500" },
  ];

  return categories.filter(c => c.count > 0);
}

/**
 * Gets functional category counts (Breakfast, Street Food, etc.)
 * by looking at primaryCategory field.
 */
export function getFunctionalCategoryCounts(): CategoryCount[] {
  const catMap: Record<string, number> = {};

  for (const item of INDIAN_FOOD_CATALOG) {
    catMap[item.primaryCategory] = (catMap[item.primaryCategory] || 0) + 1;
  }

  const categories: CategoryCount[] = [
    { label: "Breakfast", key: "Breakfast", count: catMap["Breakfast"] || 0, color: "from-amber-400 to-orange-500" },
    { label: "Main Course", key: "Main Course", count: catMap["Main Course"] || 0, color: "from-emerald-500 to-teal-500" },
    { label: "Street Food", key: "Street Food", count: catMap["Street Food"] || 0, color: "from-rose-500 to-pink-500" },
  ];

  return categories.filter(c => c.count > 0);
}

/** Total number of Indian foods in catalog */
export function getTotalFoodCount(): number {
  return INDIAN_FOOD_CATALOG.length;
}

/** Search the catalog by name — for manual food search */
export function searchCatalog(query: string): CatalogEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const exact: CatalogEntry[] = [];
  const partial: CatalogEntry[] = [];

  for (const entry of INDIAN_FOOD_CATALOG) {
    const name = entry.name.toLowerCase();
    if (name === q) {
      exact.push(entry);
    } else if (name.includes(q)) {
      partial.push(entry);
    }
  }

  return [...exact, ...partial].slice(0, 20);
}
