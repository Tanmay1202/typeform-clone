import './globals.css';

export const metadata = {
  title: 'Typeform Clone',
  description: 'A clone of Typeform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
