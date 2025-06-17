"use client";

const LoginButton = () => {
  const handleSignIn = () => {
    // Redirect to the server-side route that initiates OAuth
    window.location.href = '/auth/sign-in';
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={(e) => e.preventDefault()}>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="button"
          onClick={handleSignIn}
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};
export default LoginButton;
