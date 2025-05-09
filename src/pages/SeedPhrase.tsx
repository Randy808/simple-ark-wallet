import React from 'react';
import SeedPhraseView from '../components/seedphrase/SeedPhraseView';

const SeedPhrase: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Recovery Phrase</h1>
      <SeedPhraseView />
    </div>
  );
};

export default SeedPhrase;