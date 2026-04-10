// SIGNUP
export const signupUser = async (email, password) => {
  const res = await fetch("https://rail-bits-bharat-1.onrender.com/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

// LOGIN
export const loginUser = async (email, password) => {
  const res = await fetch("https://rail-bits-bharat-1.onrender.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};