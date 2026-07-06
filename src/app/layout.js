export const metadata = {
  title: "Deals Website",
  description: "Find the best deals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}