import { type FC } from 'react'
import styled from 'styled-components'

interface Props {}

const CenterWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f8f9fa;
  padding: 50px;
  text-align: center;
  animation: fadeIn 3s ease-in infinite;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  h1 {
    color: #dc3545;
    font-size: 3rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  p {
    font-size: 1.2rem;
    color: #6c757d;
  }
`

const NotFound: FC<Props> = () => {
  return (
    <CenterWrapper>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </CenterWrapper>
  )
}

export default NotFound
