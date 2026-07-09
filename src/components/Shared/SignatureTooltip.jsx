import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { getStrongestSignature, getAllAuthorsOfSignatures } from 'utilities/vulnerabilityAndSignatureCheck';

function SignatureTooltip({ signatureInfo }) {
  const strongestSignature = useMemo(() => getStrongestSignature(signatureInfo));

  const isCosign = strongestSignature?.tool === 'cosign';
  const authors = getAllAuthorsOfSignatures(signatureInfo) || 'Unknown';
  const showAuthors = !isCosign || authors === 'Unknown' || (authors.length > 0 && authors.length < 40);

  return isEmpty(strongestSignature) ? (
    <span>Not signed</span>
  ) : (
    <div className="flex flex-col gap-0.5 text-xs text-left">
      <div>{`Tool: ${strongestSignature?.tool || 'Unknown'}`}</div>
      {showAuthors && <div>{`Signed-by: ${authors}`}</div>}
    </div>
  );
}

export default SignatureTooltip;
