import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import {
  ArrowRight,
  BarChart2,
  Check,
  Coins,
  Github,
  Linkedin,
  Mail,
  Tags,
  Twitter,
  User,
  Users,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { TwitterLogoIcon } from "@radix-ui/react-icons"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Check,
    title: "Easy to use",
    description:
      "Our easy-to-use interface makes it simple to track your expenses and stay on top of your finances.",
  },
  {
    icon: BarChart2,
    title: "Financial Insights",
    description:
      "Get detailed reports and visualizations to understand where your money goes and how to save more effectively.",
  },
  {
    icon: Coins,
    title: "Daily Tracking",
    description:
      "Easily log and categorize your daily expenses, ensuring you stay on top of your spending habits.",
  },
  {
    icon: Users,
    title: "Group Expenses",
    description:
      "Create groups to organize shared expenses, split costs, and settle up easily with friends and family.",
  },
  {
    icon: Tags,
    title: "Categorization",
    description:
      "Our smart system automatically categorizes your expenses based on the description, saving you time and effort.",
  },
  {
    icon: Zap,
    title: "AI-Driven Insights",
    description:
      "Get personalized spending insights and recommendations powered by AI, helping you make smarter financial decisions.",
  },
]

const testimonials = [
  {
    name: "Dhruv Kotadiya",
    quote: [
      "Spendwise has ",
      "completely transformed",
      " how I manage my finances!",
    ],
  },
  {
    name: "Ayush Kalathiya",
    quote: [
      "I've never been so aware of my spending habits. ",
      "Highly recommended!",
      "",
    ],
  },
  {
    name: "Sarthak Mayani",
    quote: [
      "The insights provided by Spendwise are invaluable. It's a ",
      "game-changer!",
      "",
    ],
  },
]

const faqs = [
  {
    question: "What is Spendwise?",
    answer:
      "Spendwise is a free personal finance app designed to track expenses, manage budgets effectively, and handle group expenses.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up, start entering expenses manually or import transactions from your bank statement, set your budget goals, and invite friends to split expenses if needed.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your privacy and security are our top priorities. We use stringent measures to keep your information safe and confidential.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes, Spendwise is completely free to use. Enjoy powerful financial management tools without any fees.",
  },
]

interface Developer {
  name: string
  role: string
  bio: string
  email: string
  linkedin: string
  twitter: string
  github: string
  avatar: string
}

const developers: Developer[] = [
  {
    name: "Ayush Kalathiya",
    role: "Full Stack Developer",
    bio: "Expert in crafting user interfaces with solid backend skills. Proficient in Next.js, PostgreSQL, and Node.js.",
    email: "ayushkalathiya50@gmail.com",
    linkedin: "https://www.linkedin.com/in/ayush-kalathiya-750497254",
    twitter: "https://x.com/AyushKalathiya9",
    github: "https://github.com/Ayushkalathiya",
    avatar: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Dhruv Kotadiya",
    role: "Full Stack Developer",
    bio: "Specializes in database management with strong front-end and backend knowledge. Skilled in Next.js, PostgreSQL, and Node.js.",
    email: "dhruvkotadiya0235@gmail.com",
    linkedin: "https://www.linkedin.com/in/dhruv-kotadiya-86b2212ba",
    twitter: "https://x.com/DhruvKotad72384",
    github: "https://github.com/DhruvK007",
    avatar: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Sarthak Mayani",
    role: "Full Stack Developer",
    bio: "Versatile developer comfortable with both frontend and backend technologies. Always eager to learn new things.",
    email: "mayanisarthak@gmail.com",
    linkedin: "https://www.linkedin.com/in/sarthak-mayani-5250b1286",
    twitter: "https://x.com/SarthakMayani",
    github: "https://github.com/MACOOF",
    avatar: "/placeholder.svg?height=200&width=200",
  },
]
export default function Home() {
  return (
    //@ts-ignore
    <>
      <Navbar />
      <MaxWidthWrapper>
        <section className="px-3 pt-10 sm:pt-28 md:px-0 lg:px-0">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="w-full max-w-xl md:max-w-none md:flex-1 md:text-left">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-6xl">
                Take control of your expenses today.
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Track your spending, unleash your saving!
                <br className="hidden sm:inline" />
                <span className="sm:hidden"> </span>
                Transform expenses into financial freedom!
              </p>
              <div className="mt-4 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                Spendwise empowers you to make informed financial decisions. Our
                intuitive tools help you visualize your spending patterns, set
                realistic budgets, and achieve your financial goals with ease.
              </div>
              <Link
                href="/auth/signup"
                className="hover:bg-primary-dark hover:shadow-primary-dark/50 mt-8 inline-flex transform items-center justify-center rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white transition-transform hover:scale-105 hover:shadow-lg"
              >
                Start Your Journey
                <ArrowRight
                  className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="hidden w-full max-w-md lg:block">
              <Image
                src="/main_page.png"
                width={900}
                height={900}
                alt="Financial management illustration"
                priority
              />
            </div>
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-24">
        <section>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            Why Spendwise?
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-12 px-3 md:px-0 lg:grid-cols-3 lg:px-0">
            {features.map((feature, index) => (
              <div
                key={`features${index}`}
                className="rounded-lg p-5 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-24">
        <section>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 px-3 md:grid-cols-2 md:px-0 lg:grid-cols-3 lg:px-0">
            {testimonials.map((testimonial, index) => (
              <div
                key={`testimonials${index}`}
                className="rounded-lg p-6 shadow-md transition-transform hover:scale-105 dark:bg-gray-800"
              >
                <p className="mb-4 text-lg italic text-gray-700 dark:text-gray-300">
                  {testimonial.quote.map((part, i) =>
                    i % 2 === 1 ? (
                      <span
                        key={i}
                        className="dark:text-primary-light font-semibold text-primary"
                      >
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-24">
        <section>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Ready to Take Control?
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Discover financial freedom with Spendwise – empowering users to
              master their finances and manage group expenses effortlessly.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/auth/signup"
                className="hover:bg-primary-dark group inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="mr-2">Get Started for Free</span>
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:rotate-12"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. Start managing your finances in minutes.
            </p>
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-24">
        <section>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 pb-8 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div
                key={`faqs${index}`}
                className="rounded-lg border p-6 dark:border-gray-700"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </MaxWidthWrapper>

      <section className="w-full bg-gradient-to-b from-background to-secondary/10 py-8 md:py-10 lg:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="mb-4 pb-5 text-center text-3xl font-bold dark:text-white">
            Meet Our Developers
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer) => (
              <Card
                key={developer.name}
                className="overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50"
              >
                <CardHeader className="p-6">
                  <Avatar className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 bg-gray-100 dark:bg-gray-800/80">
                    <svg
                      className="h-16 w-16 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </Avatar>
                  <CardTitle className="text-center text-xl font-bold dark:text-white">
                    {developer.name}
                  </CardTitle>
                  <CardDescription className="text-center text-sm font-medium text-muted-foreground">
                    {developer.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-4 line-clamp-3 text-sm dark:text-gray-200">
                    {developer.bio}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link href={`mailto:${developer.email}`}>
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email {developer.name}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link
                        href={developer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">
                          {developer.name}'s LinkedIn
                        </span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link
                        href={developer.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          shape-rendering="geometricPrecision"
                          text-rendering="geometricPrecision"
                          image-rendering="optimizeQuality"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          viewBox="0 0 512 462.799"
                          className="h-4 w-4 text-gray-900 hover:text-white dark:text-white hover:dark:text-gray-900"
                        >
                          <path
                            fill="currentColor"
                            fill-rule="nonzero"
                            d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                          />
                        </svg>
                        <span className="sr-only">
                          {developer.name}'s Twitter
                        </span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="rounded-full hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link
                        href={developer.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                        <span className="sr-only">
                          {developer.name}'s GitHub
                        </span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
