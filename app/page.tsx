import dynamic from 'next/dynamic';

const FacadeCanvas = dynamic(() => import('../components/FacadeCanvas'), {
  ssr: false
});

export default function Page() {
  return (
    <main className="page">
      <section className="hero">
        <div className="copy">
          <h1>Modern Residential Fa?ade</h1>
          <p>
            Concrete, glass, metal, and wood with geometric boxes, vertical fins, and
            subtle linear LED lights. Natural daylight, photorealistic. Render up to 8K.
          </p>
        </div>
        <div className="controls"><FacadeCanvas /></div>
      </section>
    </main>
  );
}
