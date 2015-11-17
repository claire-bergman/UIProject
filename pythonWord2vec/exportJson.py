from __future__ import print_function
import gensim
from gensim.models import Word2Vec;
import numpy as np;
from numpy.linalg import norm;
import sys, os;
import re;





word2vec = Word2Vec.load('allFile');

print ("{")
for word in set(word2vec.index2word):
	print("\"", word, "\": [", word2vec[word][0], ", ", word2vec[word][1], ", ", word2vec[word][2], "],", sep="");

print ("}");
