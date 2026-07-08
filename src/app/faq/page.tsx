const faqs = [
  {
    q: "Is DealHive an official store?",
    a: "No. DealHive is an independent aggregator that shows discounts already offered on brands' own websites. All purchases happen on the brand's site, not on DealHive.",
  },
  {
    q: "How often are prices updated?",
    a: "Our system re-checks brand websites once every 24 hours. If a brand changes a price during the day, it may take up to a day to reflect here.",
  },
  {
    q: "Why don't all brands show products?",
    a: "We only display a product when we can verify a real discount directly from the brand's own data. Some brands may temporarily show no deals if none are currently verifiable.",
  },
  {
    q: "Do you take a commission or fee?",
    a: "No. DealHive does not process any payments or charge fees. We simply link you to the brand's own website.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-brand mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqs.map((item, idx) => (
          <div key={idx} className="border-b border-border pb-6">
            <h2 className="text-sm font-semibold text-brand mb-2">
              {item.q}
            </h2>
            <p className="text-sm text-muted leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}