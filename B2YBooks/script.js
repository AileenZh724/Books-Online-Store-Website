
// create a variable to store the cart data
// create a variable to store the book data
let cart = [];
let bookData = [];


// create a variable to store the pending index, the pending index is the index of the book that the user wants to add to the cart
let pendingIndex = null;

function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

// load book data from data.json

window.onload = function () {
  getJsonObject('data.json',
    function(data) {
      bookData = data;
      // render the book table
      renderTable(data);
      // add event listener to the dark mode button
      document.getElementById("dark-mode").addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
      });
      // load cart from localStorage
      const savedCart = localStorage.getItem("cart");
      const savedTotal = localStorage.getItem("cartTotal");
      if (savedCart && savedTotal) {
        cart = JSON.parse(savedCart);
        totalQuantity = parseInt(savedTotal);
        document.getElementById("cartCount").textContent = `(${totalQuantity})`;
        renderCartDetails();
      }
      // setup cart and search/filter
      setupCart();
      setupSearchAndFilter();
    },
    // handle error
    function(xhr) {
      console.error("Error loading JSON data:", xhr);
    }
  );
};


// ***********create a function to render the book list
// 1. get the book table tbody
// 2. clear the innerHTML of the tbody to avoid duplicate rows
// 3. loop through the data
// 4. create a new row for each book
// 5. append the row to the tbody
function renderTable(data) {
    const tbody = document.querySelector("#bookTable tbody"); 
    tbody.innerHTML = ""; 
  
    data.forEach((book, index) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-title", book.title.toLowerCase());
      tr.setAttribute("data-category", book.category);
  
      tr.innerHTML = `
        <td><input type="checkbox" class="bookCheckbox" data-index="${index}"></td>
        <td><img src="${book.img}" alt="Book Cover" class="bookCover"></td>
        <td class="bookTitle">${book.title}</td>
        <td>${renderStars(book.rating)}</td>
        <td>${book.authors}</td>
        <td>${book.year}</td>
        <td>$${book.price}</td>
        <td>${book.publisher}</td>
        <td>${book.category}</td>
      `;
  
      tbody.appendChild(tr);
    });
  }
// **********create a function to render rating as stars
function renderStars(rating) {
    const maxStars = 5;
    let stars = '<span class="stars">';
  // loop through the max stars, if the index is less than the rating, add a full star, otherwise add an empty star
    for (let i = 0; i < maxStars; i++) {
      if (i < rating) {
        stars += `<img src="images/star-16.ico" class="star" alt="Full Star">`;  
      } else {
        stars += `<img src="images/outline-star-16.ico" class="star" alt="Empty Star">`;  
      }
    }
    stars += '</span>';
    return stars;
  }

// ************* cart functionality
// create a variable to store the total quantity of the cart
let totalQuantity = 0;
//create a function to setup the cart
// 1. get the add to cart button and reset cart button and cart count
// 2. add event listener to the document to handle checkbox change, and only allow one checkbox to be checked
// 3. add event listener to the add to cart button to handle the click event
function setupCart() {
    const addBtn = document.getElementById("addToCartBtn");
    const resetBtn = document.getElementById("resetCartBtn");
    const cartCount = document.getElementById("cartCount");
  
    // add event listener to handle checkbox change, and only allow one checkbox to be checked
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("bookCheckbox")) {
        const allCheckboxes = document.querySelectorAll(".bookCheckbox");
        allCheckboxes.forEach((cb) => {
          if (cb !== e.target) cb.checked = false;
        });
      }
    });

// add event listener to handle the click event for Add to Cart button
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();
    // get the checked checkbox, if there is no checked checkbox, show an alert and return
      const checkedBox = document.querySelector(".bookCheckbox:checked");
      if (!checkedBox) {
        alert("Please select one book to add.");
        return;
      }
    // get the index of the checked checkbox, and store it in the pending index variable
      pendingIndex = parseInt(checkedBox.getAttribute("data-index"));
    
      // show the quantity popup, set the display style to flex
      document.getElementById("quantityPopup").style.display = "flex";
    });
  
    // add event listener to the reset cart button to handle the click event, show a confirmation dialog to ask the user if they want to reset the cart
    resetBtn.addEventListener("click", function (e) {
      e.preventDefault();
  
      const confirmed = confirm("Are you sure you want to reset the cart?");
      if (!confirmed) return;
    // reset the cart and total quantity, update the cart count text content, uncheck all checkboxes, and call renderCartDetails function
      cart = [];
      totalQuantity = 0;
      cartCount.textContent = `(0)`;
  // save the cart to local storage
        saveCartToStorage();
        // update the cart details
        renderCartDetails();
    });
    }

    // add event listener to the quantity popup confirm button to handle the click event
  document.getElementById("popupConfirm").addEventListener("click", function () {
    const quantity = parseInt(document.getElementById("popupInput").value);
// get the quantity input value, if the value is not a number or less than or equal to 0, show an alert and return
    if (!quantity || quantity <= 0) {
      alert("Invalid quantity.");
      return;
    }
  // get the selected book from the book data using the pending index
    const selectedBook = bookData[pendingIndex];
    // add the selected book and quantity to the cart array
    cart.push({ book: selectedBook, quantity });
    // update the total quantity
    totalQuantity += quantity;
  
    // update cart count
    document.getElementById("cartCount").textContent = `(${totalQuantity})`;
    renderCartDetails();
  
    // clear checked checkboxes
    document.querySelectorAll(".bookCheckbox").forEach(cb => cb.checked = false);
    document.getElementById("quantityPopup").style.display = "none";
  
    // save cart to local storage
    saveCartToStorage();
  });
  // add event listener to the quantity popup cancel button to handle the click event
    // hide the quantity popup
  document.getElementById("popupCancel").addEventListener("click", function () {
    document.getElementById("quantityPopup").style.display = "none";
  });
  
  // create a function to save the cart to local storage
  function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartTotal", totalQuantity.toString());
  }
  // load cart from localStorage
const savedCart = localStorage.getItem("cart");
const savedTotal = localStorage.getItem("cartTotal");
// if there is saved cart data, load it
if (savedCart && savedTotal) {
  cart = JSON.parse(savedCart);
  totalQuantity = parseInt(savedTotal);
  document.getElementById("cartCount").textContent = `(${totalQuantity})`;
  renderCartDetails();
}

// ***************************create a function to setup search and filter
// 1. get the search and filter button
// 2. add event listener to the buttons
// 3. call applySearchAndFilter function when the buttons are clicked

function setupSearchAndFilter() {
    const searchBtn = document.getElementById("searchBtn");
    const filterBtn = document.getElementById("filterBtn");
  
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      applySearchAndFilter();
    });
  
    filterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      applySearchAndFilter();
    });
  }
  
// create a function to apply search and filter;
// 1. get the keyword and selected category
// 2. loop through all rows in the table
// 3. check if the title includes the keyword and the category matches the selected category
// 4. set the display style of the row based on the match result
// 5. set the background color of the row based on the match result

function applySearchAndFilter() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  const rows = document.querySelectorAll("#bookTable tbody tr");

  let keywordMatchFound = false; 

  rows.forEach((row) => {
    const title = row.getAttribute("data-title");
    const category = row.getAttribute("data-category");

    const matchSearch = keyword === "" || title.includes(keyword);
    const matchCategory = selectedCategory === "Category" || category === selectedCategory;

    row.style.display = matchCategory ? "" : "none";
    // row.style.backgroundColor = (keyword !== "" && matchSearch && matchCategory) ? "#ffffcc" : "";
    // if its on dark mode, the highlight color will be different
    if (keyword !== "" && matchSearch && matchCategory) {
      row.classList.add("highlighted");
    } else {
      row.classList.remove("highlighted");
    }
    
    if (matchSearch) {
      keywordMatchFound = true;
    }
  });
// if no match is found, show an alert
  if (!keywordMatchFound && keyword !== "") {
    alert("No match found for your keyword.");
  }
}

// ******************************create a function to render the cart details
function renderCartDetails() {
  // get the cart table and tbody
    const cartTable = document.getElementById("cartTable");
    const tbody = cartTable.querySelector("tbody");
  // clear the innerHTML of the tbody to avoid duplicate rows
    tbody.innerHTML = "";
  // loop through the cart array
    cart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.book.title}</td>
        <td>${item.quantity}</td>
        <td>$${item.book.price}</td>
        <td>$${item.quantity * item.book.price}</td>
      `;
  // append the row to the tbody
      tbody.appendChild(tr);
    });
  
    // update total price
    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.book.price, 0);
    document.getElementById("totalPrice").textContent = `$${totalPrice}`;
    }
// display cart details when clicking on the cart icon
document.getElementById("cartIcon").addEventListener("click", function () {
    const cartDetails = document.getElementById("cartDetails");
    // if the cart details is hidden or not displayed, show it, otherwise hide it
    if (cartDetails.style.display === "none" || cartDetails.style.display === "") {
      cartDetails.style.display = "block";
    } else {
      cartDetails.style.display = "none";
    }
  });
  
  
  // hide cart details when clicking on the close button
  document.getElementById("closeCart").addEventListener("click", function () {
    document.getElementById("cartDetails").style.display = "none";
    }   );

    // *****************dark mode
    function darkMode() {
        var element = document.body;
        element.classList.toggle("dark-mode");
      }
