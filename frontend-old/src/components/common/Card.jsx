import "./common.css";

function Card({
  children,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <section className={ui-card ${className}}>
      {(title  description 
 action) && (
        <div className="ui-cardheader">
          <div>
            {title && <h3 className="ui-cardtitle">{title}</h3>}
            {description && (
              <p className="ui-carddescription">{description}</p>
            )}
          </div>

          {action && <div className="ui-cardaction">{action}</div>}
        </div>
      )}

      <div className="ui-card__content">{children}</div>
    </section>
  );
}

export default Card;
