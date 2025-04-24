# B2YBooks Online Store

Author:
Xiamei Zhang (Aileen Zhang)

## Features I Built

- **Display a table of books dynamically**  
  All book data is loaded from a local `data.json` file using `XMLHttpRequest`, then rendered as a styled HTML table.

-  **Search books by title (case-insensitive)**  
  Users can type a keyword in the search bar to highlight matching titles.

-  **Filter books by category**  
  A dropdown allows users to filter books by their category, showing only the selected type.

-  **Add one book at a time to the cart, with quantity popup**  
  Users can select one book using a checkbox and click "Add to Cart". A popup asks for quantity input before adding the item.

-  **View detailed cart with total price calculation**  
  Clicking the cart icon reveals a detailed cart section (at the bottom of the page) that shows itemized purchases and a total price.

-  **Toggle dark mode for better readability at night**  
  A dark mode toggle button switches the site to a dark-themed interface.

-  **Cart data persists using `localStorage`**  
  Items in the cart and their quantities are stored in the browser's localStorage so they remain after refreshing or reopening the page.

##  Project Structure
B2YBooks
├── index.html # Main webpage 
├── index.css # All styling, including light/dark themes 
├── script.js # All JavaScript functionality 
├── data.json # Book data source 
└── images/ # Book covers and icons


## How to Run

1. Make sure all files (`index.html`, `index.css`, `script.js`, `data.json`, and `/images`) are in the same directory.
2. Run `index.html` in a local server
If you have Node.js installed, follow these steps:

- Open your terminal
- Navigate to the project folder:
  ```bash
  cd path/to/your/project
  http-server
-open your browser and go to:
    http://127.0.0.1:8080/
