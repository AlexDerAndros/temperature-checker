import Link from "next/link";
import { BackButton } from "@/components/Components";

export default function Warnings() {
    return (
        <>
        <Link href="/">
              <BackButton />
        </Link>
        Warnungen
        </>
    );

}