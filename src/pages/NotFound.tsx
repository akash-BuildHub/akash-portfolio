import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { setCanonical, setMetaName, setMetaProperty, setRobots } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const title = "404 | Page Not Found";
    const description = "The page you are looking for does not exist.";
    const url = `${window.location.origin}${location.pathname}`;

    document.title = title;
    setMetaName("description", description);
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setCanonical(url);
    setRobots("noindex, nofollow");
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
