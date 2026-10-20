import Link from "next/link";
import { BackButton } from "@/components/Components";

export default function Dashboard() {
    return (
        <>
           <Link href="/">
              <BackButton />
            </Link>
          Dashboard
        </>
    )
}