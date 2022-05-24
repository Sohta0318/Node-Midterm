$(function () {
  const token = localStorage.getItem("token");
  const pathName = location.pathname;
  if (!token) {
    if (pathName === "/login" || pathName === "/register") {
    } else {
      window.location.href = "/login";
    }
    $(".inOrOut").append("<a href='/login'>Login</a>");
  } else {
    $(".inOrOut").append("<a>Logout</a>");
    $(".inOrOut").on("click", () => {
      logoutHandler("/users/logout", "/login");
    });
  }
});

const userHandler = (e, url, body, redirect) => {
  e.preventDefault();
  $.ajax(url, {
    data: JSON.stringify(body),
    contentType: "application/json",
    type: "POST",
    success: function (data) {
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("user_id", data.user._id);
      localStorage.setItem("token", data.token);
      window.location.href = redirect;
    },
    error: function (data) {
      alert("Something went wrong");
    },
  });
};
const logoutHandler = (url, redirect) => {
  const token = localStorage.getItem("token");
  $.ajax(url, {
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      window.location.href = redirect;
      localStorage.clear();
    },
    error: function (data) {
      alert("Something went wrong");
    },
  });
};
const blogHandler = (e, url, body, redirect) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  $.ajax(url, {
    data: JSON.stringify(body),
    contentType: "application/json",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      window.location.href = redirect;
    },
    error: function (data) {
      alert("Something went wrong");
    },
  });
};
$("#register").on("submit", (e) => {
  const name = $(".registerName").val();
  const email = $(".registerEmail").val();
  const password = $(".registerPassword").val();
  const registerForm = {
    name,
    email,
    password,
  };
  userHandler(e, "/users", registerForm, "/blogs");
});

$("#login").on("submit", (e) => {
  const email = $(".loginEmail").val();
  const password = $(".loginPassword").val();
  const loginForm = {
    email,
    password,
  };
  userHandler(e, "/users/login", loginForm, "/blogs");
});

$("#create_blog").on("submit", (e) => {
  const title = $(".createTitle").val();
  const description = $(".createDescription").val();
  const createForm = {
    title,
    description,
  };
  blogHandler(e, "/blogs", createForm, "/blogs");
});

$("#edit_blog").on("submit", (e) => {
  e.preventDefault();
  const pathName = location.pathname;
  console.log(pathName);
  const title = $(".editTitle").val();
  const description = $(".editDescription").val();
  const editForm = {
    title,
    description,
  };
  // blogHandler(e,`blogs/${}`);
});
