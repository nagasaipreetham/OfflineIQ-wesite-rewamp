import { Link } from 'react-router-dom'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { ArrowRight } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './AlreadyHappened.css'

const COLUMNS = [
  {
    lane: 'Exposed',
    items: [
      {
        num: '1',
        title: 'Samsung, 2023',
        body: 'Engineers pasted internal source code into ChatGPT. Twice more within three weeks. Samsung banned generative AI company-wide.',
        source: 'Forbes',
        href: 'https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/',
      },
      {
        num: '2',
        title: 'OpenAI, patched February 2026',
        body: 'A flaw let conversation content, uploaded files, and AI-generated summaries get pulled out through ordinary DNS queries. No user mistake required.',
        source: 'Check Point Research',
        href: 'https://blog.checkpoint.com/research/when-ai-trust-breaks-the-chatgpt-data-leakage-flaw-that-redefined-ai-vendor-security-trust/',
      },
    ],
  },
  {
    lane: 'Repurposed',
    items: [
      {
        num: '1',
        title: 'Zoom, 2023',
        body: 'Updated its terms to allow training AI on customer audio and video. Reversed only after the backlash made headlines.',
        source: 'TechCrunch',
        href: 'https://techcrunch.com/2023/08/08/zoom-data-mining-for-ai-terms-gdpr-eprivacy/',
      },
      {
        num: '2',
        title: 'Slack, 2024',
        body: 'Scraped customer messages to train its models by default. The opt-out existed. Almost nobody found it.',
        source: 'SecurityWeek',
        href: 'https://www.securityweek.com/user-outcry-as-slack-scrapes-customer-data-for-ai-model-training/',
      },
    ],
  },
]

function SourceArrow() {
  return (
    <svg className="happened__source-arrow" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 8L8 2M8 2H3.5M8 2V6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AlreadyHappened() {
  return (
    <section className="happened" id="already-happened">
      <ShellInner>
        <SectionPin>
          <h2 className="happened__title">
            <span className="happened__pin-num" aria-hidden="true">
              {greekNumeral(2)}.
            </span>
            <span className="happened__label">It&rsquo;s already happened</span>
          </h2>
          <div className="happened__rule" aria-hidden="true" />
        </SectionPin>

        <div className="happened__intro">
          <h3 className="happened__heading">
            This isn&rsquo;t <mark className="happened__mark">Hypothetical</mark>
          </h3>
        </div>

        <div className="happened__grid">
          {COLUMNS.map((column) => (
            <article key={column.lane} className="happened__col">
              <p className="happened__lane">{column.lane}</p>
              {column.items.map((item) => (
                <div key={item.title} className="happened__point">
                  <h4 className="happened__point-title">
                    <span className="happened__num" aria-hidden="true">
                      {item.num}
                    </span>
                    <span>{item.title}</span>
                  </h4>
                  <p className="happened__point-body">
                    {item.body}{' '}
                    <a
                      className="happened__source"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [{item.source}
                      <SourceArrow />]
                    </a>
                  </p>
                </div>
              ))}
            </article>
          ))}
        </div>

        <div className="happened__more">
          <Link className="happened__more-link" to="/security">
            See the full record
            <ArrowRight />
          </Link>
        </div>
      </ShellInner>
    </section>
  )
}

export default AlreadyHappened
