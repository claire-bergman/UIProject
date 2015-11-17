import gensim
from gensim.models import Word2Vec;
import numpy as np;
from numpy.linalg import norm;
import sys, os;
import re;

curDir = '/data/training';
savedDir = os.getcwd();
os.chdir(savedDir + curDir);
files = [f for f in os.listdir('.')];

sentences = [];
f = files[0]
print f;
for line in open(f, 'r').readlines():
	letters_only = re.sub("[^a-zA-Z]", " ", line);
	lower_case = letters_only.lower();
	sentences.append(lower_case.split());



os.chdir(savedDir);

myModel = Word2Vec(sentences, size=3, alpha=0.025, window=5, max_vocab_size=10000,
 seed=1, workers=3);

myModel.save("allFile");