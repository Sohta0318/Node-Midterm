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

const blogHandler = (e, url, body, redirect, method) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  $.ajax(url, {
    data: JSON.stringify(body),
    contentType: "application/json",
    type: method,
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

const getBlogHandler = (url) => {
  const token = localStorage.getItem("token");
  const data = $.ajax(url, {
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      return data;
    },
    error: function (data) {
      alert("Something went wrong");
    },
  });
  return data;
};

const deleteHandler = (url) => {
  const token = localStorage.getItem("token");
  $.ajax(url, {
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    success: function (data) {
      window.location.href = "/blogs";
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
  blogHandler(e, "/blogs", createForm, "/blogs", "POST");
});

$(() => {
  const pathName = location.pathname;
  if (pathName === "/blogs") {
    const wrapper = $(".blog-wrapper");
    const blogs = getBlogHandler("/blogs2");
    blogs.then((data) => {
      data.forEach((element) => {
        const id = element._id;
        const title = element.title;
        const description = element.description;
        // * Name owner
        const blog = `<div class="blog-each">
        <h2>Name</h2>
        <h1>${title}</h1>
        <p>${description}</p>
        <div class="blog-button">
          <button><a href='/edit_blog/${id}'>Edit</a></button>
          <button id='delete'><a href='/blogs_delete/${id}'>Delete</a></button>
          <button id='delete'><a href='/favorite/${id}'>Favorite</a></button>
        </div>
      </div>`;
        wrapper.append(blog);
      });
    });

    if (pathName.includes("/favorite/")) {
      //* favorite
    }
  }

  if (pathName.includes("/blogs_delete/")) {
    const test = pathName.split("/");
    const id = test[2];
    deleteHandler(`/blogs/${id}`);
  }

  if (pathName.includes("edit_blog")) {
    const test = pathName.split("/");
    const id = test[2];
    const blog = getBlogHandler(`/blogs/${id}`);
    blog.then((data) => {
      $(".editTitle").val(data.title);
      $(".editDescription").text(data.description);
    });
    $("#edit_blog").on("submit", (e) => {
      const title = $(".editTitle").val();
      const description = $(".editDescription").val();
      const editForm = {
        title,
        description,
      };
      blogHandler(e, `/blogs/${id}`, editForm, "/blogs", "PATCH");
    });
  }

  //* favorite
  if (pathName === "/favorites") {
    const wrapper = $(".favorite-wrapper");
    const favorites = getBlogHandler("/favorites2");
    favorites.then((data) => {
      data.forEach((element) => {
        const id = element._id;
        const title = element.title;
        const description = element.description;
        const favorite = `<div class="favorite-each">
        <h2>Name</h2>
        <h1>${title}</h1>
        <p>${description}</p>
        <div class="favorite-button">
          <button id='delete'><a href=''>Delete</a></button>
        </div>
      </div>`;
        wrapper.append(favorite);
      });
    });
  }
});
