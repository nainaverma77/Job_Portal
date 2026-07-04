async function test() {
  try {
    console.log("Testing Registration...");
    const regRes = await fetch("http://localhost:5000/api/v1/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "testuser" + Date.now() + "@example.com",
        phoneNumber: "1234567890",
        password: "password123",
        role: "student"
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message);
    
    console.log("Registration Success:", regData.message);
    const email = regData.user.email;

    console.log("Testing Login...");
    const loginRes = await fetch("http://localhost:5000/api/v1/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "password123",
        role: "student"
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message);

    console.log("Login Success:", loginData.message);
    console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
  } catch (error) {
    console.log("Test Failed with Error:", error.message);
  }
}

test();
