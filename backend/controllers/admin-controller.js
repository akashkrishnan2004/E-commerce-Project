const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin12345";

export async function admin(req, res) {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Admin logged in" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}
