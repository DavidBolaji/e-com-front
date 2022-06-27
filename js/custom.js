// to get current year
const moreBtn = document.getElementById("more");
const logo = document.querySelectorAll("#logo");
const card = document.getElementById("product-card");
const login_form = document.getElementById("login-btn");
const logo_btn = document.getElementById("logo-btn");
const product_btn = document.getElementById("product-btn");
const admin_page = document.getElementById("admin");
const logoutBtn = document.getElementById("logout");
const title = document.getElementById("title");
const price = document.getElementById("price");
const fileInput = document.getElementById("file");

let skip = 0;

function getYear() {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  document.querySelector(
    "#displayYear"
  ).innerHTML = `<p>© ${currentYear} All Rights Reserved By <a href="#">ecommerce</a></p>`;
}

const getLogo = async () => {
  const url = `https://ologunleko-ecommerce.herokuapp.com/api/v1/logo`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "apllication/json",
    },
  });

  const response = await res.json();

  if (response) {
  }

  console.log(response);

  return response;
};

if (admin_page) {
  const auth = localStorage.getItem("token");
  if (!auth) {
    window.location.href = "login.html";
  }
}

const login = async (details) => {
  const url = `https://ologunleko-ecommerce.herokuapp.com/api/v1/user/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  console.log(res);

  const response = await res.json();

  if (response) {
  }

  console.log(response);

  return response;
};

const upload = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("images", fileInput.files[0]);

  sendForm(formData, "https://ologunleko-ecommerce.herokuapp.com/api/v1/logo")
    .then((data) => {
      console.log(data);
      alert("File uploaded Succesfully");
    })
    .catch((e) => {
      console.log(e);
      alert("Server Error try agin later");
    });
};

const product = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("images", fileInput.files[0]);
  formData.append("title", title.value);
  formData.append("price", price.value);

  sendForm(
    formData,
    "https://ologunleko-ecommerce.herokuapp.com/api/v1/product/create"
  )
    .then((data) => {
      console.log(data);
      alert("upload Succesful");
    })
    .catch((e) => {
      console.log(e);
      alert("Server Error try agin later");
    });
};

const sendForm = async (formData, url) => {
  const res = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData, // body data type must match "Content-Type" header
  });

  const response = await res.json();

  if (response) {
  }

  console.log(response);

  return response;
};

const logout = async (e) => {
  e.preventDefault();
  const url = `https://ologunleko-ecommerce.herokuapp.com/api/v1/user/logout`;
  const authT = localStorage.getItem("token");

  console.log(authT);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authT}`,
    },
  });

  console.log(res);

  const response = await res.json();
  console.log(response);

  if (response._id) {
    localStorage.clear();
    window.location.href = "login.html";
  }
};

const getProduct = async (skip = 0) => {
  const url = `https://ologunleko-ecommerce.herokuapp.com/api/v1/product/find?skip=${skip}`;

  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "apllication/json",
    },
  });

  const result = await response.json();

  if (result) {
  }

  console.log(result);

  return result;
};

const loadMore = (e) => {
  skip += 1;
  console.log(skip);
  e.preventDefault();
  getProduct(skip).then((res) => {
    res.products.forEach((product) => {
      const html = `<div class="col-sm-6 col-md-4 col-lg-4"><div class="box"><div class="option_container"><div class="options"><a href="contact.html" class="option2"> Buy Now </a></div></div><div class="img-box"><img src=${product.img} alt=""></div><div class="detail-box"><h5> ${product.title} </h5><h6> $${product.price} </h6></div></div></div>`;
      document
        .getElementById("product-card")
        .insertAdjacentHTML("beforeend", html);
    });
    if (
      document.getElementById("product-card").childElementCount === res.total
    ) {
      moreBtn.classList.add("disabled");
    }
  });
};

if (moreBtn) {
  moreBtn.addEventListener("click", loadMore);
}

if (logo) {
  getLogo().then((res) => {
    Array.from(logo).forEach((logo) => {
      logo.setAttribute("src", res[0].pic);
    });
  });
}

if (card) {
  getProduct().then((res) => {
    res.products.forEach((product) => {
      const html = `<div class="col-sm-6 col-md-4 col-lg-4"><div class="box"><div class="option_container"><div class="options"><a href="contact.html" class="option2"> Buy Now </a></div></div><div class="img-box"><img src=${product.img} alt=""></div><div class="detail-box"><h5> ${product.title} </h5><h6> $${product.price} </h6></div></div></div>`;
      document
        .getElementById("product-card")
        .insertAdjacentHTML("beforeend", html);
    });
    console.log(document.getElementById("product-card").childElementCount);
  });
}

if (login_form) {
  login_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    console.log(formProps);
    login({
      email: formProps.email,
      password: formProps.password,
    }).then((res) => {
      localStorage.setItem("token", res.token);
      window.location.replace("admin.html");
    });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (logo_btn) {
  logo_btn.addEventListener("click", upload);
}

if (product_btn) {
  product_btn.addEventListener("click", product);
}

getYear();

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: true,
  navText: [],
  autoplay: true,
  autoplayHoverPause: true,
  navText: [
    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    '<i class="fa fa-angle-right" aria-hidden="true"></i>',
  ],
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    1000: {
      items: 2,
    },
  },
});

/** google_map js **/
function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(40.712775, -74.005973),
    zoom: 18,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

const loaded = () => {};
