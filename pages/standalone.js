// External packages used:
//   yarn add react-share react-twitter-embed react-fb-like
import React, { useState } from 'react'
import Link from 'next/link'
import { SocialShareAndFollow } from 'react-share-follow'

import { config } from 'config/config'

import { googleEvent } from 'components/page/GoogleAnalytics'
import { PageHead } from 'components'

const LandingPage = () => (
  <main>
    <PageHead />

    <Headline
      title={config.appTagline}
      description={config.appDescription}
    >
      <SocialShareAndFollow
        title={config.appName}
        description={config.appDescription}
        iconColor='#555555'
        share={{
          copy: true,
          email: true,
          sms: false,
          facebook: true,
          twitter: true,
          reddit: false,
          pinterest: false,
          linkedin: true
        }}
        follow={{
          web: 'https://www.tomorroworld.com/',
          twitter: 'TomorroworldAB',
          instagram: 'tomsoderlund',
          linkedin: 'company/tomorroworld'
        }}
        onShare={({ message }) => window.alert(message)}
      />
    </Headline>

    <CustomSignupBlock />

    <Block padding='2em 1em'>
      Get the template source code from <a className='button' href='https://github.com/tomsoderlund/nextjs-generic-landing-page' target='_blank' rel='noopener noreferrer'>GitHub</a>
    </Block>

    <Image
      src='/features/feature1.jpg'
      fullWidth={false}
    />

    <Features
      features={config.appFeatures}
      fullWidth={false}
    />

    <Pricing
      products={config.appProducts}
    />

    <Video
      src='https://www.youtube.com/embed/-8-ZyyQy3hU'
      controls={false}
      fullWidth={false}
    />

    <Features
      headline='What our customers are saying'
      features={config.appTestimonials}
    />

    <CustomSignupBlock />

    <Footer>
      &copy; Company, Inc. | <a href='https://www.tomorroworld.com/' target='_blank' rel='noopener noreferrer'>Template by Tomorroworld</a>
    </Footer>
  </main>
)

export default LandingPage

// ----- Components -----

const Block = ({ children, className, style, background, padding = '1em' }) => (
  <div
    className={`block ${className || ''}`}
    style={style}
  >
    {children}
    <style jsx>{`
      div {
        padding: ${padding};
        flex: 1;
        ${background ? `background-color: ${background};` : ''}
      }

      div.columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
      }

      div.rows {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }

      @media only screen and (max-width: 480px) {
        div.columns {
          flex-direction: column;
        }
      }
    `}
    </style>
  </div>
)

const Headline = (props) => (
  <Block
    padding='2em 1em'
    className='headline color-header-bg color-header-fg'
    {...props}
  >
    {props.title && <h1>{props.title}</h1>}
    {props.description && <h2 className='description'>{props.description}</h2>}
    {props.children && <>{props.children}</>}
  </Block>
)

const CustomSignupBlock = () => (
  <SignupBlock
    thankyouText='Thank you for signing up!'
    className='darker'
    leadService={config.leadService}
  />
)

const SignupBlock = (props) => {
  return (
    <Block className='signup-block' {...props}>
      <SignupForm {...props} />
    </Block>
  )
}

const SignupForm = ({ leadService, googleEventName = 'Lead sign up', buttonText = 'Sign up', thankyouText = 'Thank you!' }) => {
  const [personInfo, setPersonInfo] = useState({ email: '' })
  const setPersonInfoField = (field, value) => setPersonInfo({ ...personInfo, [field]: value })

  const [inProgress, setInProgress] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setInProgress(true)
    try {
      const result = await fetch(leadService, { // eslint-disable-line no-undef
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personInfo)
      })
      if (result.status === 200) {
        setIsSubmitted(true)
        if (googleEventName) {
          googleEvent(googleEventName)
        }
      } else {
        const json = await result.json()
        setHasErrors(json.message)
      }
    } catch (err) {
      console.warn(`Warning: ${err.message || err}`)
      setHasErrors(err.message)
    } finally {
      setInProgress(false)
    }
  }

  return (
    <form className='signup-form' onSubmit={handleSubmit}>
      {!isSubmitted ? (
        <>
          <input
            name='email'
            type='email'
            value={personInfo.email}
            required
            placeholder='Your email'
            onChange={event => setPersonInfoField('email', event.target.value)}
            disabled={inProgress}
          />
          <button
            type='submit'
            className='primary'
            disabled={inProgress}
          >
            {buttonText}
          </button>
          {hasErrors ? <p className='error color-error-fg'>{hasErrors}</p> : null}
        </>
      ) : (
        <h3 className='thankyou'>{thankyouText}</h3>
      )}
    </form>
  )
}

const Features = (props) => (
  <Block className='columns' padding='1em 0' {...props}>
    {props.features.map(feature => (
      <LinkOptional
        key={feature.name}
        href={feature.link}
        as={feature.as}
        target={feature.target}
        className='link-wrapper'
      >
        <Block className='feature rows'>
          <h3>{feature.name}</h3>
          {feature.imageSrc && <img src={feature.imageSrc} alt={feature.name} title={feature.name} />}
          {feature.description && <p className='description'>{feature.description}</p>}
        </Block>

        <style jsx>{`
          img {
            max-width: 100%;
            object-fit: contain;
          }

          @media only screen and (max-width: 480px) {
            :global(.feature.rows) {
              padding: 0;
            }

            :global(.feature .description) {
              margin-left: 0.5em;
              margin-right: 0.5em;
            }  
          }

          :global(.feature .description) {
            margin-top: 0.5em;
          }

          :global(.link-wrapper) {
            flex: 1;
            text-decoration: none;
            color: inherit;
          }
        `}
        </style>
      </LinkOptional>
    ))}
  </Block>
)

const Image = (props) => {
  const imageName = props.src.split('/').pop().split('.').shift()
  return (
    <Block padding='0' {...props}>
      <img src={props.src} alt={props.title || imageName} title={props.title} />
      <style jsx>{`
        img {
          width: 100%;
          object-fit: cover;
        }
      `}
      </style>
    </Block>
  )
}

const Video = (props) => {
  return (
    <Block padding='0' {...props}>
      <div className='video-container'>
        <iframe
          width='853'
          height='480'
          src={props.src + '?rel=0' + ((props.controls === false) && '&controls=0')}
          frameBorder='0'
          allowFullScreen
        />
      </div>
      <style jsx>{`
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          padding-top: 30px; height: 0; overflow: hidden;
        }
         
        .video-container iframe,
        .video-container object,
        .video-container embed {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}
      </style>
    </Block>
  )
}

const Pricing = ({ products, onSelect, title = 'Pricing', inProgress, ...otherProps }) => {
  return (
    <Block padding='0 1em 2em' {...otherProps}>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {products.map((product, pIndex) => (
              <th key={pIndex}>{product.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {products.map((product, pIndex) => (
              <td key={pIndex}>
                <ul>
                  {product.features.map((feature, fIndex) => (
                    <li key={fIndex}>{feature}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
        <tfoot>
          <tr>
            {products.map((product, pIndex) => {
              const { label, ...actionProps } = product.action
              return (
                <td key={pIndex}>
                  <a
                    {...actionProps}
                    onClick={e => onSelect && onSelect(product.reference)}
                    className={'button primary progress-animation ' + (product.action.className || '') + (inProgress ? ' in-progress' : '')}
                  >
                    {label}
                  </a>
                </td>
              )
            })}
          </tr>
        </tfoot>
      </table>

      <style jsx>{`
        table {
          table-layout: fixed;
          margin: auto;
          width: 100%;
          max-width: 60em;
        }

        td {
          vertical-align: top;
        }

        .button {
          min-width: 10em;
        }
      `}
      </style>
    </Block>
  )
}

const Footer = ({ children }) => (
  <footer
    className='color-footer-bg color-footer-fg'
  >
    {children}
    <style jsx>{`
      footer {
        font-size: 0.7em;
        padding: 1em;
      }
    `}
    </style>
  </footer>
)

const LinkOptional = (props) => {
  const { href, as, children, ...otherProps } = props
  return (
    href
      ? href.includes('http')
        ? (
          <a href={href} {...otherProps}>{children}</a>
        )
        : (
          <Link href={href} as={as}>
            <a {...otherProps}>{children}</a>
          </Link>
        )
      : (
        <>{children}</>
      )
  )
}
