const postHandler = (e, url, body, redirect) => {
  e.preventDefault();
  $.ajax(url, {
    data: JSON.stringify(body),
    contentType: "application/json",
    type: "POST",
    success: function (data) {
      window.location.href = redirect;
    },
    error: function (data) {
      alert("Something went wrong");
    },
  });
};
$("#register").on("submit", (e) => {
  const sample = {
    name: "sohta",
    email: "nicosota@gmail.com",
    password: "test123",
  };
  postHandler(e, "/users", sample, "/blogs");
});
