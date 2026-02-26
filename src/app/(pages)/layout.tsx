import Footer from '@/components/layout/Footer'
import MainHeader from '@/components/MainHeader'

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainHeader />
      <main>{children}</main>
      <Footer />
    </>
  )
}
