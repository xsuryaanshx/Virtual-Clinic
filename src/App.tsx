import { useEffect, useState } from "react";
import Chat from "./pages/user/Chat";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // simulate any async init (supabase/auth/etc)
        await Promise.resolve();
        setReady(true);
      } catch (e) {
        console.error("INIT ERROR:", e);
        setReady(true);
      }
    };

    init();
  }, []);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return <Chat />;
}
