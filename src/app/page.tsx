import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { ArrowRight, BarChart2, Check, Coins } from "lucide-react"
import Image from "next/image"
import RegisterServiceWorker from "@/components/RegisterServiceWorker"
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
      "Spendwise is a free personal finance app designed to track expenses and manage budgets effectively.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up, start entering expenses manually or import transactions from your bank statement, and set your budget goals.",
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

export default async function Home() {
  return (
    <>
      <Navbar />

      <MaxWidthWrapper>
        <section className="px-3 pt-28 md:px-0 lg:px-0">
          <div className="flex flex-col items-center justify-between gap-12 pt-10 md:flex-row">
            <div className="w-full max-w-xl md:max-w-none md:flex-1 md:text-left">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-6xl">
                Take control of your expenses today.
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Track your spending, unleash your saving!
                <br className="hidden sm:inline" />
                Transform expenses into financial freedom!
              </p>
              <div className="mt-4 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                Spendwise empowers you to make informed financial decisions. Our
                intuitive tools help you visualize your spending patterns, set
                realistic budgets, and achieve your financial goals with ease.
              </div>
              <Link
                href="/auth/signup"
                className="hover:bg-primary-dark mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white transition-colors"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden w-full max-w-md lg:block">
              <Image
                src="/main_page.png"
                width={900}
                height={900}
                alt="Financial management illustration"
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
                key={"features" + index}
                className="rounded-lg p-8 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
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
                key={"testimonials" + index}
                className="rounded-lg p-6 shadow-md dark:bg-gray-800"
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
              master their finances.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/auth/signup"
                className="hover:bg-primary-dark inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white transition-colors"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
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
                key={"faqs" + index}
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
    </>
  )
}
