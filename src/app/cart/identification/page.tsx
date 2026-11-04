import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getCartWithItems } from "@/data/cart";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { calculateCartTotalInCents } from "@/helpers/cart";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { toCartSummaryProducts } from "../helpers/cart-summary-products";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/authentication");
  }
  const cart = await getCartWithItems(session.user.id);
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
    orderBy: (address, { asc }) => [asc(address.createdAt)],
  });
  const cartTotalInCents = calculateCartTotalInCents(cart.items);
  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={toCartSummaryProducts(cart.items)}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default IdentificationPage;
