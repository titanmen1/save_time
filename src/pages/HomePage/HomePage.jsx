import './HomePage.css'
import girl from '../../img/drawing-2194233-0 1.svg'
import girlBg from '../../img/Vector.png'

export const HomePage = () => {
  return (
    <div className={'home-page'}>
      <div className={'hello-block'}>
        <p className={'hello-block-title'}>
           Good day, <span>David</span>
        </p>
        <p className={'hello-block-text'}>
          You have 5 tasks for today and 14 tasks for this week
        </p>
      </div>

      <button className={'button'} link={'/today'}>start</button>

      <div className={'home-page-img'}>
        <img alt={''} src={girl} className={"girl"}/>
        <img alt={''} src={girlBg} className={"girl-bg"}/>
      </div>
      
    </div>
  )
}