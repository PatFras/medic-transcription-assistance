import { useEffect } from "react";

const ScriptLoader = () => {
  useEffect(() => {
    const scripts = [
      "path-to-lib/axios/dist/axios.standalone.js",
      "path-to-lib/CryptoJS/rollups/crypto-js.js",
      "path-to-lib/CryptoJS/rollups/sha256.js",
      "path-to-lib/CryptoJS/components/hmac.js",
      "path-to-lib/CryptoJS/components/enc-base64.js",
      "path-to-lib/url-template/url-template.js",
      "path-to-lib/apiGatewayCore/sigV4Client.js",
      "path-to-lib/apiGatewayCore/apiGatewayClient.js",
      "path-to-lib/apiGatewayCore/simpleHttpClient.js",
      "path-to-lib/apiGatewayCore/utils.js",
      "path-to-lib/apigClient.js",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  return null;
};

export default ScriptLoader;
