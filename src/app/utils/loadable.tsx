import { LoadingOverlay } from "@mantine/core"
import type { FunctionComponent } from "react"
import { Suspense } from "react"

export function withLoader<T extends object>(Component: FunctionComponent<T>) {
  const SuspensedComponent = (props: T) => {
    return (
      <Suspense fallback={<LoadingOverlay visible />}>
        <Component {...props} />
      </Suspense>
    )
  }

  return SuspensedComponent
}
