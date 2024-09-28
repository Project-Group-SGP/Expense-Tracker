"use client"

import { settings } from "@/actions/auth/settings"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ModeToggle } from "@/components/ModeToggle"
import { Passwordcmp } from "@/components/Passwordcmp"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useCurrentUserClient } from "@/hooks/use-current-user"
import { SettingsSchema } from "@/lib/index"
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotification,
} from "@/notifications/pushService"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  IconBell,
  IconLock,
  IconMail,
  IconPalette,
  IconShieldLock,
  IconUser,
} from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import zxcvbn from "zxcvbn"

const SettingsPage = () => {
  // ... (keep the existing state and hooks)
  const user = useCurrentUserClient()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const [isPasswordVisible1, setIsPasswordVisible1] = useState<boolean>(false)
  const [isPasswordVisible2, setIsPasswordVisible2] = useState<boolean>(false)
  const [oldpassword, setoldPassword] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorpassword, setErrorpassword] = useState<string | undefined>("")
  const [errorpassword1, setErrorpassword1] = useState<string | undefined>("")
  const [onoff, setonoff] = useState<boolean>(false)

  const Password_testResult = useMemo(() => zxcvbn(password), [password])
  // console.log(Password_testResult)
  const password_score = useMemo(
    () => (Password_testResult.score * 100) / 4,
    [Password_testResult.score]
  )

  const PassProgressColor = useCallback(() => {
    switch (Password_testResult.score) {
      case 0:
        return "#828282"
      case 1:
        return "#EA1111"
      case 2:
        return "#FFAD00"
      case 3:
        return "#9bc158"
      case 4:
        return "#00b500"
      default:
        return "none"
    }
  }, [Password_testResult.score])

  const createPassLable = useCallback(() => {
    switch (Password_testResult.score) {
      case 0:
        return "Very weak"
      case 1:
        return "Weak"
      case 2:
        return "Fear"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return "none"
    }
  }, [Password_testResult.score])

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      // used undefined not "" becatuse prisma will save this-> "" in db when we don't what to save any thing in db use undefined
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnable: user?.isTwoFactorEnable || undefined,
      theme: undefined,
    },
  })
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    if (oldpassword !== "") {
      if (password === "") {
        setErrorpassword("Password field is empty!")
        return
      }
      if (password_score < 70) {
        setErrorpassword("Set an Strong password Password")
        return
      }
    }
    if (password !== "") {
      if (oldpassword === "") {
        setErrorpassword1("Password field is empty!")
        return
      }
    }
    // console.log(values);
    // if(password == "" && oldpassword =="" && !values.email && !values.isTwoFactorEnable && !values.name){
    //   setSuccess("Theme successfully saved");
    //   return;
    // }
    values.theme = undefined
    const newvalues = {
      ...values,
      password: oldpassword,
      newPassword: password,
      isTwoFactorEnable: onoff,
    }
    // console.log("values:", newvalues)
    const toastid: any = toast.loading("Evaluating Updates...")
    startTransition(() => {
      settings(newvalues)
        .then((data) => {
          if (data.error) {
            toast.error(data.error, {
              id: toastid,
            })
          } else if (data.success) {
            update()
            toast.success(data.success, {
              id: toastid,
            })
          }
        })
        .catch((e) => {
          toast.error("Something went wrong!!", {
            id: toastid,
          })
        })
    })
  }
  return (
    <MaxWidthWrapper>
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <div className="z-10 mb-4 flex items-center justify-between bg-white py-4 dark:bg-zinc-950">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-32"
            >
              Save Changes
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <IconUser size={18} />
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            defaultValue={user?.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {user?.isOAuth === false && (
                    <FormField
                      disabled={isPending}
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <IconMail size={18} />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="john@example.com"
                              defaultValue={user?.email}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {user?.isOAuth === false && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Security</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <IconLock size={18} />
                            Old Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={isPasswordVisible1 ? "text" : "password"}
                                onChange={(e) => {
                                  setoldPassword(e.target.value)
                                  setErrorpassword1("")
                                }}
                                value={oldpassword}
                                className="pr-10"
                              />
                              <Passwordcmp
                                isPasswordVisible={isPasswordVisible1}
                                setisPasswordVisible={setIsPasswordVisible1}
                              />
                            </div>
                          </FormControl>
                          {errorpassword1 !== "" && (
                            <FormMessage>{errorpassword1}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isPending}
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <IconLock size={18} />
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={isPasswordVisible2 ? "text" : "password"}
                                onChange={(e) => {
                                  setPassword(e.target.value)
                                  setErrorpassword("")
                                }}
                                value={password}
                                className="pr-10"
                              />
                              <Passwordcmp
                                isPasswordVisible={isPasswordVisible2}
                                setisPasswordVisible={setIsPasswordVisible2}
                              />
                            </div>
                          </FormControl>
                          {errorpassword === "" &&
                            password !== "" &&
                            !isPending && (
                              <div className="mt-2">
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                      width: `${password_score}%`,
                                      backgroundColor: PassProgressColor(),
                                    }}
                                  ></div>
                                </div>
                                <p
                                  className="mt-1 text-sm"
                                  style={{ color: PassProgressColor() }}
                                >
                                  {createPassLable()}
                                </p>
                              </div>
                            )}
                          {errorpassword !== "" && (
                            <FormMessage>{errorpassword}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isPending}
                      control={form.control}
                      name="isTwoFactorEnable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              <div className="flex items-center gap-2">
                                <IconShieldLock size={18} />
                                Two Factor Authentication
                              </div>
                            </FormLabel>
                            <FormDescription>
                              Enable two factor authentication for your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                setonoff(checked)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Preferences</h2>
                </CardHeader>
                <CardContent>
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            <div className="flex items-center gap-2">
                              <IconPalette size={18} />
                              Theme
                            </div>
                          </FormLabel>
                          <FormDescription>
                            Choose between light and dark mode
                          </FormDescription>
                        </div>
                        <FormControl>
                          <ModeToggle />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>

          <PushSubscriptionToggleButton />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    async function getActivePushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription()
        setHasActivePushSubscription(!!subscription)
      } catch (error) {
        console.error("Error fetching push subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getActivePushSubscription()
  }, [])

  async function setPushNotificationEnabled(enabled: boolean) {
    setIsToggling(true)
    try {
      if (enabled) {
        await registerPushNotifications()
        toast.success("Push notifications enabled", {
          closeButton: true,
        })
      } else {
        await unregisterPushNotification()
        toast.success("Push notifications disabled", {
          closeButton: true,
        })
      }
      setHasActivePushSubscription(enabled)
    } catch (error) {
      console.error("Error toggling push notification:", error)
      if (enabled && Notification.permission === "denied") {
        toast.warning(
          "Please enable push notifications in your browser settings"
        )
      } else {
        toast.error("Something went wrong, please try again later", {
          closeButton: true,
        })
      }
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Notifications</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="text-base font-medium">
              <div className="flex items-center gap-2">
                <IconBell size={18} />
                Push Notifications
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Receive push notifications on this device
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Switch
              checked={hasActivePushSubscription}
              onCheckedChange={setPushNotificationEnabled}
              disabled={isToggling}
            />
          )}
        </div>
        {isToggling && (
          <div className="mt-2 flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span className="text-sm text-muted-foreground">
              {hasActivePushSubscription ? "Disabling" : "Enabling"}{" "}
              notifications...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SettingsPage
