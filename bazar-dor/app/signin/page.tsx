const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data, error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      callbackURL: "/profile",
    });

    if (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
      return;
    }

    if (data) {
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.replace("/profile");
      router.refresh();
    }
  } catch (err) {
    console.error("Login request failed:", err);
    toast.error("Login failed. Check the browser console.");
  } finally {
    setLoading(false);
  }
};