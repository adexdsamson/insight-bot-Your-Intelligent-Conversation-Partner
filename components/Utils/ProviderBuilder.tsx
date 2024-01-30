
/**
 * A function that builds a provider component in a typescript-react application.
 * 
 * @param {Array} componentsWithProps - An array of provider components with their respective props.
 * @returns {Function} - A function that returns a provider component.
 */
export const provideBuilder = (componentsWithProps = []) => {
  const initialComponent = ({ children }) => <>{children}</>;
  return componentsWithProps.reduce((AccumulatedComponents, [Provider, props = {}]) => {
    return ({ children }) => {
      return (
        <AccumulatedComponents>
          <Provider {...props}>{children}</Provider>
        </AccumulatedComponents>
      )
    }
  }, initialComponent);
}