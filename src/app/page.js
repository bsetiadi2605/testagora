import dynamic from 'next/dynamic'
 
const DynamicHeader = dynamic(() => import('../agora/App'), {
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  return (
    <div>
      <DynamicHeader />
    </div>
  )
}
