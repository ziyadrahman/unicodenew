# unicode
# unicodenew
# unicodenew

 Unicode Generator
A MERN-based application that generates unique Unicode codes for products, enabling users to upload and extract product data efficiently. Designed for structured inventory or product management systems, it simplifies code generation, categorization, and product lookup.

🚀 Tech Stack
Frontend: React.js, Bootstrap

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

🔧 Key Features
Generate unique Unicode codes for each product

Upload and manage product data

Categorize data into branches, categories, subcategories, and items

User authentication (Signup, Login, Logout)

Retrieve all product-related data with a single API call


POST   /signup        - User signup  
POST   /login         - User login  
GET    /logout        - User logout  
GET    /verifyjwt     - Verify JWT token  

POST   /upload              - Upload product data  
POST   /add_branch          - Add a new branch  
POST   /add_category        - Add a new category  
POST   /add_subcategory     - Add a new subcategory  
POST   /add_item            - Add a new item  
GET    /fetchAllData        - Fetch all product data (complete dataset)  
GET    /fetch-data          - Fetch specific product data


 How It Works
User Signup/Login

JWT-based authentication to secure user sessions.

Upload Product Info

Upload product details and generate a unique Unicode for each item.

Add Structured Data

Organize products into branches, categories, subcategories, and items.

Fetch Data

Use /fetchAllData to get everything or /fetch-data for specific lookups.


🎨 UI & Styling
The frontend is styled with Bootstrap, ensuring responsive and clean design for product listings, forms, and dashboard components.