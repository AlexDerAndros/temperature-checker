import Link from "next/link";
import { BackButton } from "@/components/Components";

export default function Settings() {
    return (
        <>
        <Link href="/">
              <BackButton />
        </Link>
         Einstellungen
        </>
    )
}