import React from 'react'

const Block = ({ children, fullWidth = true, id, className, style, background, padding = '1em' }) => (
  <div
    className={[
      'block',
      ...(fullWidth ? [] : ['not-full-width']),
      ...(className ? [className] : [])
    ].join(' ')}
    style={style}
    id={id}
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

export default Block
