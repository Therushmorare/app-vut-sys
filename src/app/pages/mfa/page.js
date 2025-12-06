import { useRouter } from "next/router";
import MFA from "../../components/auth/Mfa";

export default function MFAPage() {
  const router = useRouter();

  const handleVerify = (data) => {
    console.log("MFA Verified:", data);
    // Redirect to dashboard after MFA
    router.push("/dashboard");
  };

  return <MFA onVerify={handleVerify} />;
}