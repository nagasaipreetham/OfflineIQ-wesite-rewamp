import './Partner.css'

function Partner() {
  return (
    <section className="partner" aria-label="Official partner">
      <div className="partner__field-wrap" aria-hidden="true">
        <div className="partner__field" />
      </div>

      <div className="partner__inner">
        <p className="partner__label">OFFICIALLY PARTNERED WITH:</p>

        <div className="partner__logo">
          <img
            className="partner__logo-img"
            src="/amd-logo.svg"
            alt="AMD"
            width={180}
            height={43}
          />
          <span className="partner__shine" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

export default Partner
