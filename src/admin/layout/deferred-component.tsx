import { useEffect } from "react";
import { PropsWithChildren, useState } from "react";

/**  200ms이 지나기 전에는 children을 화면에 렌더하지 않는 컴포넌트입니다. */
const DeferredComponent = ({ children }: PropsWithChildren<{}>) => {
  const [isDeferred, setIsDeferred] = useState(false);

  useEffect(() => {
    // 200ms 지난 후 children Render
    const timeoutId = setTimeout(() => {
      setIsDeferred(true);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isDeferred) {
    return null;
  }

  return <>{children}</>;
};

export default DeferredComponent;
