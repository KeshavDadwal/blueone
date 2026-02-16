"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

function termsandcondition() {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setTimeout(() => setloading(false), 500);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="wrapper pt-0 mt-0 pb-20 relative top-0">
          <HelmetProvider>
  <Helmet>
    <title>Terms of Use | BluOne Ink Publishing</title>
    <meta name="description" content="This page governs your use of and access to BluOne Ink's website(s) and other online properties." />
    <link rel="canonical" href="https://www.bluone.ink/resources/policies/terms" />
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
                  <h1 className="text-center font-medium">
                    Terms & Conditions
                  </h1>
                  <i>
                    <h6 className="mt-14 font-semibold">Terms of Use</h6>
                  </i>
                  <h6>Effective date of terms of use: March 13, 2023</h6>
                  <p>
                    These terms and conditions apply to this website and any
                    other website, application, online portal, or service that
                    is in any way related or linked to this website and/or its
                    terms and conditions, such as author websites, operated
                    and/or made available by BluOne Ink (collectively referred
                    to as the “Sites”). All software used on this Site and all
                    content included on this site (including without limitation
                    site design, text, graphics, audio, and video and the
                    selection and arrangement thereof) is the property of BluOne
                    Ink India or its suppliers and is protected by international
                    copyright laws.
                  </p>
                  <p>
                    These terms and conditions constitute the agreement
                    (“Agreement”) between “you” (user) and “us” (BluOne Ink) and
                    govern your use of the Sites. By accessing this site, you
                    are consenting to be bound by this Agreement. If you do not
                    agree with the terms of usage provided in these terms and
                    conditions, you must leave this site immediately.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Content Usage:</strong>
                  </h6>
                  <ul className="list-disc px-5 pb-5">
                    <li className="font-ibm">
                      All content provided and materials made available on this
                      site are solely for home and/or non-commercial purposes.
                    </li>
                    <li className="font-ibm">
                      Your use of this site does not grant you ownership of any
                      content or material available on the website.
                    </li>
                  </ul>
                  <h6 className="mt-4 w-full block">
                    <strong>Changes to Terms of Use:</strong>
                  </h6>
                  <p>
                    BluOne Ink India Private Limited (“BluOne Ink”, “WE”, “US”,
                    OR “OUR”) reserves the right, at our discretion, to change,
                    modify, add, or remove portions of these terms and
                    conditions of use at any time. Please check these terms
                    periodically for changes. All changes will become effective
                    24 hours after posting, and your continued use of the Sites
                    following the posting of changes to these terms of use will
                    signify your acceptance of those changes. Additional terms
                    and conditions may govern the purchase of products, such as
                    return and shipping policies.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Copyright and Ownership:</strong>
                  </h6>
                  <p>
                    All content on this site, including but not limited to text,
                    music, sound, photographs, videos, graphics, and images, is
                    governed by the Indian Copyright Act, 1957 and subsequent
                    amendments, the Trademark Act, 1999 and subsequent
                    amendments, moral rights, and other laws relating to
                    intellectual property rights.
                  </p>
                  <ul className="list-disc px-5 pb-5 font-ibm">
                    <li className="font-ibm">
                      None of the content may be downloaded, copied, reproduced,
                      republished, posted, transmitted, stored, sold, or
                      distributed without the prior written permission of the
                      copyright holder, except for material specifically made
                      available for ‘downloads’ and sharing on social media for
                      personal, non-commercial home use only, provided that all
                      copyright and proprietary notices are retained.
                    </li>
                    <li className="font-ibm">
                      Modification of any content or use of any content for any
                      purpose other than as set out herein (including on any
                      other website or computer network) is prohibited.
                    </li>
                    <li className="font-ibm">
                      Except as permitted under applicable copyright laws, you
                      are responsible for obtaining permission before reusing
                      any copyrighted material available on the Sites. Requests
                      to republish or reuse content, and use of quotations or
                      extracts from books published by BluOne Ink, should be
                      addressed to the Publicity Department at the email
                      editors@bluOne.ink or postal address below.
                    </li>
                  </ul>
                  <h6 className="mt-4 w-full block">
                    <strong>Site Access License:</strong>
                  </h6>
                  <p>
                    BluOne Ink grants you a limited, revocable, non-exclusive,
                    non-transferable license to access and make personal,
                    non-commercial use of the Sites or their Content. You may
                    not download (other than page caching or unless otherwise
                    allowed by BluOne Ink or permitted by law) or modify all or
                    any portion of the Sites and their Content. This license
                    does not include resale or commercial use of the Sites or
                    their Content, collection and use of product listings,
                    descriptions, or prices, derivative use of the Sites or
                    their Content, downloading or copying of account information
                    for the benefit of another merchant, or any use of data
                    mining, robots, or similar data gathering and extraction
                    tools. Unauthorized use terminates the permissions and
                    licenses granted by BluOne Ink.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Corporate Identification and Trademark:</strong>
                  </h6>
                  <p>
                    All trademarks, service marks, and trade names used herein
                    (including but not limited to the corporate names and logos
                    of BluOne Ink and its divisions and imprints, names and
                    designs of the Sites, and any logos) are trademarks or
                    registered trademarks of BluOne Ink or its affiliates,
                    partners, vendors, or licensors. You may not use, copy,
                    reproduce, republish, upload, post, transmit, distribute, or
                    modify such trademarks without BluOne Ink’s express prior
                    written consent, except for a limited, non-exclusive,
                    non-transferable right to create a link to any page of the
                    Sites, provided it does not portray BluOne Ink or its
                    affiliates in a false, misleading, derogatory, or offensive
                    manner.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Links to Third-Party Websites:</strong>
                  </h6>
                  <p>
                    The site may include links to third-party Internet websites
                    controlled and maintained by others. These links are
                    provided solely for user convenience and do not constitute
                    endorsement by BluOne Ink India of the linked sites or their
                    content. BluOne Ink has no control over the content of any
                    such sites.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Fees:</strong>
                  </h6>
                  <p>
                    For all charges for products and services sold on the Sites,
                    BluOne Ink or its vendors will bill your credit card or
                    alternative payment method. By providing credit card
                    information, you represent that you are the authorized user
                    of the card. Legal action may be taken to collect unpaid
                    balances, and you agree to reimburse BluOne Ink for all
                    expenses incurred.
                  </p>
                  <h6 className="mt-4 w-full block">
                    <strong>Privacy Policy:</strong>
                  </h6>
                  <p>
                    Data collection and use, including personal information, are
                    governed by BluOne Ink’s Privacy Policy, which is
                    incorporated into this Agreement.
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

export default termsandcondition;
