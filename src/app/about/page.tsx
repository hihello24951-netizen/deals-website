export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-brand mb-4">How DealHive Works</h1>
      <p className="text-muted leading-relaxed mb-8">
        DealHive is an independent deals aggregator. We track live prices and
        discounts directly from the official websites of Pakistani fashion,
        footwear, bags, electronics, grocery, and beauty brands, and bring
        them together in one place so you can browse and compare before
        deciding where to shop.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-brand mb-2">
            Where our data comes from
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Our system automatically checks participating brand websites once
            a day and records current prices and discounts. We only display a
            deal when we can verify an original price and a discounted price
            directly from the brand&apos;s own product data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand mb-2">
            We are not the seller
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            DealHive does not sell products or process payments. Every
            &quot;Go to Deal&quot; button takes you directly to the brand&apos;s own
            website, where you complete your purchase with them, under their
            own terms, shipping, and return policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-brand mb-2">
            Accuracy and freshness
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Prices are refreshed once every 24 hours. Because brands update
            their own sites independently, there may occasionally be a short
            delay between a price changing on a brand&apos;s website and it
            updating here. Always confirm the final price on the brand&apos;s
            site before purchasing.
          </p>
        </section>
      </div>
    </div>
  );
}