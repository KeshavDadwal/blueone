"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

function disclaimer() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="wrapper pt-0 mt-0 pb-20 relative top-0">
          <HelmetProvider>
  <Helmet>
    <title>Disclaimer | BluOne Ink Publishing</title>
    <meta name="description" content="This page highlights BluOne Ink's limited liability related to the information and content on our website, as well as its use and access." />
    <link rel="canonical" href="https://www.bluone.ink/resources/policies/disclaimer" />
  </Helmet>
</HelmetProvider>
          {/* Page Container */}
          <div className="w-full bottom-0">
            <img
              src="/banner-back.png"
              className="w-full h-[500px] blogbannerpath"
            />
          </div>

          <section>
            <div className="container relative z-[1111]">
              <div className="blog-wrapper p-10 lg:w-[70%] -mt-96 mx-auto bg-white rounded-3xl shadow-md">
                <div className="w-full">
                  {/* <i><p className="text-[#007DD7] font-medium font-ibm text-lg text-center pb-4">Back to All Policies</p></i> */}
                  <h1 className="text-center mb-10 mt-4 font-medium">Disclaimer</h1>
                  <p>
                    Your use of and browsing on the Sites are at your own risk.
                    Except as otherwise provided above, everything on the Sites,
                    including any products or services offered for sale, is
                    provided “as is” without warranty of any kind, either
                    express or implied, including but not limited to the implied
                    warranties of merchantability, fitness for a particular
                    purpose, and non-infringement. BluOne Ink makes no
                    warranties or representations regarding the information or
                    content contained on the Sites, and specifically disclaims
                    any warranty as to the suitability, reliability, timeliness,
                    or accuracy of the information or content contained on the
                    Sites for any purpose. BluOne Ink does not warrant that the
                    functionalities contained in the content will be
                    uninterrupted or error-free, that defects will be corrected,
                    or that the Sites or the server that makes such content
                    available are free of viruses or other harmful components.
                    BluOne Ink does not warrant or make any representations
                    regarding the use or the results of the use of the contents
                    on the Sites in terms of their correctness, accuracy,
                    reliability, or otherwise. You (and not BluOne Ink) assume
                    the entire cost of all necessary servicing, repair, or
                    correction. To the extent applicable law does not allow the
                    exclusion of implied warranties, the above exclusion may not
                    apply to you.
                  </p>
                  <p>
                    Under no circumstances shall BluOne Ink or any of its
                    vendors be liable for any damages that result from the use
                    of or inability to use the BluOne Ink Sites, including but
                    not limited to reliance by a user on any information or
                    content obtained from BluOne Ink’s Sites, or that result
                    from mistakes, omissions, interruptions, deletion of files
                    or email, errors, defects, viruses, delays in operation or
                    transmission, or any failure of performance, whether or not
                    resulting from acts of God, communications failure, theft,
                    destruction, unauthorized access to BluOne Ink’s records,
                    programs, or services, or otherwise. User hereby
                    acknowledges that this disclaimer and limitation of
                    liability shall apply to all content, merchandise, and
                    services available through the Sites.
                  </p>
                  <p>
                    In no event shall BluOne Ink or any affiliated BluOne Ink
                    entity or individual, licensor, or vendor be liable for any
                    indirect, consequential, special, incidental, or punitive
                    damages arising out of your access to, or use of, the Sites
                    or the content thereon, whether in a contract action or
                    based on negligence, or other tort action, or any other
                    claim whatsoever, even if BluOne Ink or a BluOne Ink
                    authorized representative has been advised of the
                    possibility of such damages. To the extent applicable law
                    does not allow the limitation or exclusion of liability or
                    incidental or consequential damages, the above limitation or
                    exclusion may not apply to you. In no event shall BluOne
                    Ink’s aggregate liability to you for all damages, losses,
                    and causes of action whether in contract, tort (including,
                    but not limited to, negligence) or otherwise arising out of
                    the agreement and your use of the Sites and the content
                    exceed the amount paid by you for any content purchased by
                    you on the Sites or the amount paid by you, if any, for
                    accessing the Sites.
                  </p>
                  <h6>
                    <strong>Indemnification</strong>
                  </h6>
                  <p>
                    You agree to defend, indemnify, and hold BluOne Ink, its
                    parent companies, subsidiaries, affiliates, successors,
                    directors, officers, employees, service providers, and
                    agents from any and all liabilities, costs, and expenses,
                    including reasonable attorneys’ fees, related to any
                    violation of these terms by you, or in connection with the
                    use of the Sites or the Internet, or the placement or
                    transmission of any message or information on the Sites by
                    you.
                  </p>
                  <p>
                    If you registered as a member of a Site, you are entirely
                    responsible for any and all activities that occur under your
                    account and agree to indemnify, defend, and hold harmless
                    the above-mentioned parties for any liability or expense
                    arising from such use or misuse. You agree to immediately
                    notify us of any unauthorized use of your account or any
                    other breach of security known to you.
                  </p>
                  <h6 className="">
                    <strong>Force Majeure</strong>
                  </h6>
                  <p>
                    Neither BluOne Ink nor you shall be responsible for damages
                    or for delays or failures in performance resulting from acts
                    or occurrences beyond their respective reasonable control,
                    including, without limitation: fire, lightning, explosion,
                    power surge or failure, water, acts of God, war, revolution,
                    civil commotion, or acts of civil or military authorities or
                    public enemies; any law, order, regulation, ordinance, or
                    requirement of any government or legal body or any
                    representative of any such government or legal body; or
                    labor unrest, including without limitation, strikes,
                    slowdowns, picketing, or boycotts; inability to secure raw
                    materials, transportation facilities, fuel or energy
                    shortages, or acts or omissions of other common carriers.
                  </p>
                  <h6>
                    <strong>Governing Law</strong>
                  </h6>
                  <p>
                    The Sites are created and controlled by BluOne Ink India.
                    These disclaimers, terms, and conditions of use are governed
                    by all the laws applicable within the territory of India. By
                    using any of the Sites, you hereby consent to the exclusive
                    jurisdiction and venue of courts in New Delhi, India, in all
                    disputes arising out of or relating to the use of the Sites.
                    If any portion of these terms is held to be unenforceable,
                    the unenforceable portion shall be construed in accordance
                    with applicable law to the greatest extent possible to
                    reflect the original intentions of the parties, and the
                    remainder of the provisions shall remain in full force and
                    effect. BluOne Ink’s failure to insist upon or enforce
                    strict performance of any provision of these Terms of Use
                    shall not be construed as a waiver of any provision or
                    right.
                  </p>
                  <p>
                    Disputes may be referred to Arbitration at the choice of
                    BluOne Ink only, which shall then be governed as per the
                    Arbitration and Conciliation Act, 1996.
                  </p>
                  <h6>
                    <strong>Agreement</strong>
                  </h6>
                  <p>
                    This Agreement is the entire agreement between the user and
                    BluOne Ink and supersedes any prior understandings or
                    agreements (written or oral).
                  </p>
                  <h6>
                    <strong>User Information</strong>
                  </h6>
                  <p>
                    BluOne Ink collects information on what pages are accessed
                    or visited by consumers, as well as information volunteered
                    by the consumer, such as survey information and/or site
                    registrations. BluOne Ink uses this information for internal
                    review, in order to improve the content of the Site and to
                    notify consumers about updates to the Site. BluOne Ink
                    guarantees that if you supply your postal address online,
                    you will only be sent the information for which you provided
                    your address. If you do not wish to receive email from
                    BluOne Ink in the future, or if you wish to be removed from
                    mailing lists, please let us know by sending an email to
                    editors@bluone.ink.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default disclaimer;
