/* Shared by admin.js and gallery.js. Fill in the two values from Supabase > Project Settings > API. */
const CONFIG = {
  url: 'https://nkvhjujlkubufcnixics.supabase.co',      // e.g. https://abcdxyz.supabase.co
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdmhqdWpsa3VidWZjbml4aWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MDI2MjQsImV4cCI6MjEwNjQ3ODYyNH0.6B4Tyy8fUYL9STaD-Xw-QlPNFyBsfWOOmNZTSUG4AM8'  // the "anon public" key (safe to publish)
};
/* [panel id on the home page, label shown in admin] */
const CATEGORIES = [
  ['men-shirts', "Men's Shirts"], ['men-tshirts', "Men's T-Shirts"],
  ['men-pants', "Men's Trousers"], ['men-shoes', "Men's Shoes"],
  ['kids-shirts', "Kids' Shirts"], ['kids-tshirts', "Kids' T-Shirts"],
  ['kids-pants', "Kids' Trousers"], ['kids-shoes', "Kids' Shoes"]
];