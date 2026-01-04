import './globals.css';

export const metadata = {
  title: 'Flux Agent - AI Health Co-pilot',
  description: 'Your intelligent food ingredient analyzer',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-slate-100">
        {children}
      </body>
    </html>
  );
}
