import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/Navbar"
import {
  ArrowRight,
  BarChart2,
  Check,
  Coins,
  Tags,
  Users,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import DeveloperSection from "@/components/DeveloperSection"

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
    name: "Yash Kakadiya",
    quote: [
      "Spendwise has ",
      "completely transformed",
      " how I manage my finances!",
    ],
  },
  {
    name: "Meet Gangani",
    quote: [
      "I've never been so aware of my spending habits. ",
      "Highly recommended!",
      "",
    ],
  },
  {
    name: "Akshay Lakkad",
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

export default function Home() {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <section className="px-3 pt-24 sm:pt-28 md:px-0 lg:px-0">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="w-full max-w-xl md:max-w-none md:flex-1 md:text-left">
              <h1 className="group text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-6xl">
                Take control of your{" "}
                <span className="relative inline-block transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]">
                  expenses
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </span>{" "}
                today.
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
                className="group mt-8 inline-flex transform items-center justify-center rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                Start Your Journey
                <ArrowRight
                  className="ml-2 h-5 w-5 transform transition-all duration-300 ease-in-out"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="hidden w-full max-w-md lg:block">
              <div className="transform transition-transform duration-300 ease-in-out hover:scale-105">
                <Image
                  src="/main_page.png"
                  width={900}
                  height={900}
                  alt="Financial management illustration"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-24">
        <section>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            Why Spendwise?
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-12 px-3 md:grid-cols-2 md:px-0 lg:grid-cols-3 lg:px-0">
            {features.map((feature, index) => (
              <div
                key={`features${index}`}
                className="rounded-lg p-5 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 ease-in-out hover:scale-110">
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
                className="rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:bg-gray-800"
              >
                <p className="mb-4 text-lg italic text-gray-700 dark:text-gray-300">
                  {testimonial.quote.map((part, i) =>
                    i % 2 === 1 ? (
                      <span
                        key={i}
                        className="dark:text-primary-light hover:text-primary-dark font-semibold text-primary transition-colors duration-300 ease-in-out"
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
                  className="h-5 w-5 transition-transform duration-300 ease-in-out"
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
                className="group rounded-lg border p-6 transition-all duration-300 ease-in-out hover:shadow-md dark:border-gray-700"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors duration-300 ease-in-out hover:text-primary group-hover:text-primary dark:text-white">
                  {faq.question}
                </h3>
                <p className="pointer-events-none text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-8">
        <DeveloperSection />
      </MaxWidthWrapper>
    </>
  )
}
