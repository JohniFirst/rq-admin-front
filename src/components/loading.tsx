import styled from 'styled-components'

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Loading = () => {
  return (
    <LoadingContainer>
      <img src="/public-svgs/loading.svg" width={'800px'} alt="loading" />
    </LoadingContainer>
  )
}

export default Loading
